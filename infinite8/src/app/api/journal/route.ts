import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const session = await auth();
	if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const entries = await prisma.journalEntry.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 50 });
	return NextResponse.json(entries);
}

export async function POST(request: Request) {
	const session = await auth();
	if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json();
	const created = await prisma.journalEntry.create({ data: { userId: session.user.id, principle: body.principle, content: body.content, mood: body.mood ?? null } });
	return NextResponse.json(created);
}

