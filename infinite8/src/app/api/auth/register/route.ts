import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
	const { name, email, password } = await request.json().catch(() => ({}));
	if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return NextResponse.json({ error: "Email in use" }, { status: 409 });
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({ data: { name: name ?? null, email, hashedPassword, profile: { create: {} }, program: { create: {} } } });
	return NextResponse.json({ id: user.id, email: user.email });
}

