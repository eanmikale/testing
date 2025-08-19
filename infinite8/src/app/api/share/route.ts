import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
	const session = await auth();
	if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const slug = uuidv4().slice(0, 8);
	const link = await prisma.sharedJourneyLink.create({ data: { userId: session.user.id, slug, isPublic: true } });
	return NextResponse.json({ url: `/share/${link.slug}` });
}

