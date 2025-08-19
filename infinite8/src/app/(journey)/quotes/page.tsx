"use client";
import { useEffect, useState } from "react";

export default function QuotesPage() {
	const [quotes, setQuotes] = useState<any[]>([]);
	useEffect(() => {
		fetch("/api/quotes").then((r) => r.json()).then(setQuotes);
	}, []);
	return (
		<div className="p-6 max-w-3xl mx-auto space-y-3">
			<h1 className="text-2xl font-semibold">Quotes</h1>
			{quotes.map((q) => (
				<div key={q.id} className="border rounded-lg p-3">
					<div className="italic">“{q.text}”</div>
					<div className="text-sm text-slate-600 dark:text-slate-400">— {q.author} · {q.principle}</div>
				</div>
			))}
		</div>
	);
}

