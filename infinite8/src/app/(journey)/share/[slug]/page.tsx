import { prisma } from "@/lib/prisma";

export default async function PublicJourneyPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const link = await prisma.sharedJourneyLink.findUnique({ where: { slug }, include: { user: true } });
	if (!link || !link.isPublic) return <div className="p-8">Not found</div>;
	const entries = await prisma.journalEntry.findMany({ where: { userId: link.userId }, orderBy: { createdAt: "desc" }, take: 20 });
	return (
		<div className="p-6 max-w-3xl mx-auto space-y-4">
			<h1 className="text-2xl font-semibold">{link.user?.name ?? link.user?.email}&apos;s Journey</h1>
			{entries.map((e) => (
				<div key={e.id} className="border rounded-lg p-3">
					<div className="text-xs text-slate-500">{e.principle} · {e.createdAt.toDateString()}</div>
					<div>{e.content}</div>
				</div>
			))}
		</div>
	);
}

