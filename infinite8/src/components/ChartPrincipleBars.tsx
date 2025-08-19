"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ChartPrincipleBars() {
	const [data, setData] = useState<{ principle: string; count: number }[]>([]);
	useEffect(() => {
		fetch("/api/stats/journal").then((r) => r.json()).then(setData).catch(() => setData([]));
	}, []);
	return (
		<div className="w-full h-64">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data} margin={{ left: 12, right: 12 }}>
					<CartesianGrid vertical={false} strokeDasharray="3 3" />
					<XAxis dataKey="principle" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={50} />
					<YAxis allowDecimals={false} width={30} />
					<Tooltip />
					<Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

