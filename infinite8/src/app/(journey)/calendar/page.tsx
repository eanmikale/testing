import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PRINCIPLES } from "@/lib/constants";

export default async function CalendarPage() {
	const session = await auth();
	if (!session?.user) return <div className="p-8">Please sign in.</div>;
	const program = await prisma.userProgram.upsert({
		where: { userId: session.user.id },
		create: { userId: session.user.id },
		update: {},
	});
	const start = program.startDate;
	const weeks = Array.from({ length: 8 }, (_, i) => i);
	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-semibold mb-2">8‑Week Program</h1>
			<p className="text-slate-600 dark:text-slate-400 mb-4">Cycle repeats automatically from your start date: {start.toDateString()}</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{weeks.map((i) => {
					const p = PRINCIPLES[i];
					const startOfWeek = new Date(start.getTime() + i * 7 * 24 * 60 * 60 * 1000);
					return (
						<div key={p.key} className="rounded-xl border p-4">
							<div className="text-sm text-slate-500">Week {i + 1}</div>
							<div className="text-lg font-medium" style={{ color: p.color }}>{p.label}</div>
							<div className="text-sm text-slate-600 dark:text-slate-400">Starts {startOfWeek.toDateString()}</div>
							<p className="mt-2 text-sm">{p.description}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}

