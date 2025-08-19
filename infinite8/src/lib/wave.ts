import crypto from "crypto";

export type ClientWaveSignals = {
	userAgent: string;
	language: string;
	timezone: string;
	screen: { width: number; height: number; pixelRatio: number } | null;
	clockSkewMs: number;
	gestureAtMs: number;
};

export function generateWaveDigest(nonce: string, signals: ClientWaveSignals) {
	const payload = JSON.stringify({ nonce, signals });
	return crypto.createHash("sha256").update(payload).digest("hex");
}

export function validateWaveFreshness(gestureAtMs: number, now: number = Date.now(), maxDriftMs: number = 60_000) {
	return Math.abs(now - gestureAtMs) <= maxDriftMs;
}

