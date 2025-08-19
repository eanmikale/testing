import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
	const { email } = await request.json().catch(() => ({ email: undefined }));
	if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
	const nonce = crypto.randomUUID();
	const expires = new Date(Date.now() + 5 * 60 * 1000);
	await prisma.verificationToken.create({ data: { identifier: email, token: nonce, expires } });
	return NextResponse.json({ nonce, expiresAt: expires.toISOString() });
}

