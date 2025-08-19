"use client";
import { useEffect, useState } from "react";

export default function ChatRoomPage() {
	const [messages, setMessages] = useState<any[]>([]);
	const [input, setInput] = useState("");

	useEffect(() => {
		fetch("/api/chat/general/messages").then((r) => r.json()).then(setMessages);
	}, []);

	async function send() {
		if (!input.trim()) return;
		await fetch("/api/chat/general/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: input }) });
		setInput("");
		const refreshed = await fetch("/api/chat/general/messages").then((r) => r.json());
		setMessages(refreshed);
	}

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Square Chat</h1>
			<div className="border rounded-xl p-4 h-[60vh] overflow-y-auto space-y-2">
				{messages.map((m) => (
					<div key={m.id} className="text-sm"><span className="text-slate-500">{m.user?.name ?? "anon"}:</span> {m.content}</div>
				))}
			</div>
			<div className="mt-3 flex gap-2">
				<input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded-md px-3 py-2" placeholder="Type a message" />
				<button onClick={send} className="px-3 py-2 rounded-md bg-black text-white">Send</button>
			</div>
		</div>
	);
}

