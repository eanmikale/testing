"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { generateWaveDigest, type ClientWaveSignals } from "@/lib/wave";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleWaveSignIn() {
		setLoading(true);
		try {
			const nonceRes = await fetch("/api/wave/nonce", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
			const { nonce } = await nonceRes.json();
			const signals: ClientWaveSignals = {
				userAgent: navigator.userAgent,
				language: navigator.language,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				screen: typeof window !== "undefined" ? { width: window.screen.width, height: window.screen.height, pixelRatio: window.devicePixelRatio } : null,
				clockSkewMs: 0,
				gestureAtMs: Date.now(),
			};
			const providedDigest = generateWaveDigest(nonce, signals);
			const verify = await fetch("/api/wave/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nonce, signals, providedDigest, email }) });
			const okRes = await verify.json();
			if (!okRes.ok) throw new Error("Wave verification failed");
			await signIn("credentials", { email, waveDigest: providedDigest, nonce, redirect: true, callbackUrl: "/dashboard" });
		} finally {
			setLoading(false);
		}
	}

	async function handlePasswordSignIn(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		try {
			await signIn("credentials", { email, password, redirect: true, callbackUrl: "/dashboard" });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-black p-6">
			<div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 shadow-xl">
				<h1 className="text-2xl font-semibold mb-6">Welcome to Infinite 8</h1>
				<form onSubmit={handlePasswordSignIn} className="space-y-3">
					<input className="w-full rounded-md border px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<input className="w-full rounded-md border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
					<button disabled={loading} className="w-full rounded-md bg-black text-white py-2">Sign in</button>
				</form>
				<div className="my-4 text-center text-sm text-slate-500">or</div>
				<button onClick={handleWaveSignIn} disabled={loading} className="w-full rounded-md bg-indigo-600 text-white py-2">One‑Wave Key</button>
			</div>
		</div>
	);
}

