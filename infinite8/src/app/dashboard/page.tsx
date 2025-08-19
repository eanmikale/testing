import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PRINCIPLES, getPrincipleByIndex } from "@/lib/constants";
import ChartPrincipleBars from "@/components/ChartPrincipleBars";

export default async function DashboardPage() {
	const session = await auth();
	if (!session?.user) {
		return <div className="p-8">Please sign in.</div>;
	}
	const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { program: true } });
	const startDate = user?.program?.startDate?.toISOString() ?? new Date().toISOString();
	const now = new Date();
	const weeksElapsed = Math.floor((now.getTime() - new Date(startDate).getTime()) / (7 * 24 * 60 * 60 * 1000));
	const current = getPrincipleByIndex(weeksElapsed);
	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Infinite 8 Journey</h1>
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
				<div className="rounded-xl border p-4">
					<h2 className="font-medium mb-2">This Week</h2>
					<div className="text-xl" style={{ color: current.color }}>{current.label}</div>
					<p className="text-slate-600 dark:text-slate-400 mt-1">{current.description}</p>
				</div>
				<div className="rounded-xl border p-4">
					<h2 className="font-medium mb-2">8-Week Cycle</h2>
					<div className="grid grid-cols-4 gap-2">
						{PRINCIPLES.map((p) => (
							<div key={p.key} className="rounded-md p-3 text-sm border" style={{ borderColor: p.color }}>
								<div className="font-medium" style={{ color: p.color }}>{p.label}</div>
							</div>
						))}
					</div>
				</div>
				<div className="rounded-xl border p-4">
					<h2 className="font-medium mb-2">Your Journaling</h2>
					<ChartPrincipleBars />
				</div>
			</div>
			<form action={async () => {
				"use server";
				// create share link
				// This is a simple server action wrapper calling prisma directly
				// but we keep API route for client use as well.
				const slug = Math.random().toString(36).slice(2, 10);
				await prisma.sharedJourneyLink.create({ data: { userId: session.user.id, slug, isPublic: true } });
			}}>
				<button className="rounded-md border px-3 py-2">Create share link</button>
			</form>
		</div>
	);
}

