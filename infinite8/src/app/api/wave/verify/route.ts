import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWaveDigest, type ClientWaveSignals, validateWaveFreshness } from "@/lib/wave";

export async function POST(request: Request) {
	const { nonce, signals, providedDigest, email } = (await request.json().catch(() => ({}))) as {
		nonce?: string;
		signals?: ClientWaveSignals;
		providedDigest?: string;
		email?: string;
	};
	if (!nonce || !signals || !providedDigest || !email) {
		return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
	}
	const token = await prisma.verificationToken.findUnique({ where: { token: nonce } });
	if (!token || token.identifier !== email || token.expires < new Date()) {
		return NextResponse.json({ ok: false, error: "Invalid or expired nonce" }, { status: 400 });
	}
	if (!validateWaveFreshness(signals.gestureAtMs)) {
		return NextResponse.json({ ok: false, error: "Stale gesture" }, { status: 400 });
	}
	const expected = generateWaveDigest(nonce, signals);
	if (expected !== providedDigest) {
		return NextResponse.json({ ok: false, error: "Digest mismatch" }, { status: 400 });
	}
	return NextResponse.json({ ok: true });
}

