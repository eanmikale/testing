import { prisma } from "@/lib/prisma";

export default async function MarketplacePage() {
	const listings = await prisma.marketplaceListing.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Marketplace</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{listings.map((l) => (
					<div key={l.id} className="rounded-xl border p-4">
						<div className="font-medium">{l.title}</div>
						<div className="text-sm text-slate-600 dark:text-slate-400">{l.description}</div>
						<div className="mt-2 text-sm">{(l.priceCents / 100).toFixed(2)} {l.currency}</div>
					</div>
				))}
			</div>
		</div>
	);
}

