import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const principle = searchParams.get("principle") ?? undefined;
	const quotes = await prisma.quote.findMany({ where: { principle: principle as any }, take: 20, orderBy: { createdAt: "desc" } });
	return NextResponse.json(quotes);
}

