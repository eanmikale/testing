import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import OpenAI from "openai";

export async function GET(_req: Request, { params }: { params: Promise<{ room: string }> }) {
	const { room } = await params;
	const roomSlug = room;
	const chatRoom = await prisma.chatRoom.upsert({ where: { slug: roomSlug }, create: { slug: roomSlug, name: roomSlug, createdByUserId: (await prisma.user.findFirst())?.id ?? (await prisma.user.create({ data: { email: `system@${roomSlug}.local` } })).id }, update: {} });
	const messages = await prisma.chatMessage.findMany({ where: { roomId: chatRoom.id, status: "APPROVED" as any }, orderBy: { createdAt: "asc" }, take: 100, include: { user: true } });
	return NextResponse.json(messages.map((m) => ({ id: m.id, content: m.content, user: { id: m.userId, name: m.user?.name ?? m.user?.email }, createdAt: m.createdAt })));
}

export async function POST(request: Request, { params }: { params: Promise<{ room: string }> }) {
	const session = await auth();
	if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { room } = await params;
	const roomSlug = room;
	const chatRoom = await prisma.chatRoom.upsert({ where: { slug: roomSlug }, create: { slug: roomSlug, name: roomSlug, createdByUserId: session.user.id }, update: {} });
	const { content } = await request.json().catch(() => ({ content: "" }));
	if (!content || content.length > 2000) return NextResponse.json({ error: "Invalid content" }, { status: 400 });
	let status: any = "APPROVED";
	try {
		if (process.env.OPENAI_API_KEY) {
			const openai = new OpenAI();
			const mod = await openai.moderations.create({ model: "omni-moderation-latest", input: content });
			if (mod.results?.[0]?.flagged) status = "REJECTED";
		}
	} catch {}
	const message = await prisma.chatMessage.create({ data: { roomId: chatRoom.id, userId: session.user.id, content, status } });
	return NextResponse.json({ id: message.id, status: message.status });
}

