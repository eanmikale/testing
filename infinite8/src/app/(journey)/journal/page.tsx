"use client";
import { useEffect, useState } from "react";

export default function JournalPage() {
	const [entries, setEntries] = useState<any[]>([]);
	const [content, setContent] = useState("");
	const [principle, setPrinciple] = useState("SELF_DISCIPLINE");

	useEffect(() => {
		fetch("/api/journal").then((r) => r.json()).then(setEntries).catch(() => setEntries([]));
	}, []);

	async function addEntry() {
		const res = await fetch("/api/journal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, principle }) });
		const created = await res.json();
		setEntries([created, ...entries]);
		setContent("");
	}

	return (
		<div className="p-6 max-w-3xl mx-auto space-y-4">
			<h1 className="text-2xl font-semibold">Journal</h1>
			<div className="rounded-xl border p-4 space-y-2">
				<select value={principle} onChange={(e) => setPrinciple(e.target.value)} className="border rounded-md px-3 py-2">
					<option>SELF_DISCIPLINE</option>
					<option>SELF_RESPONSIBILITY</option>
					<option>PERSISTENCE</option>
					<option>FEARLESSNESS</option>
					<option>EXCELLENCE</option>
					<option>FORESIGHT</option>
					<option>CHARACTER</option>
					<option>HUMILITY</option>
				</select>
				<textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border rounded-md p-2" rows={4} placeholder="Write your reflection..." />
				<button onClick={addEntry} className="px-3 py-2 rounded-md bg-black text-white">Add Entry</button>
			</div>
			<div className="space-y-3">
				{entries.map((e) => (
					<div key={e.id} className="border rounded-lg p-3">
						<div className="text-xs text-slate-500">{e.principle}</div>
						<div>{e.content}</div>
					</div>
				))}
			</div>
		</div>
	);
}

