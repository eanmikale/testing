export const PRINCIPLES = [
	{
		key: "SELF_DISCIPLINE",
		label: "Self-discipline",
		color: "#7C3AED",
		description:
			"Do what must be done, when it must be done, whether you feel like it or not.",
	},
	{
		key: "SELF_RESPONSIBILITY",
		label: "Self-responsibility",
		color: "#2563EB",
		description:
			"Own your choices and outcomes; respond rather than react.",
	},
	{
		key: "PERSISTENCE",
		label: "Persistence",
		color: "#059669",
		description:
			"Keep going—small steps compound into great distances.",
	},
	{
		key: "FEARLESSNESS",
		label: "Fearlessness",
		color: "#EA580C",
		description:
			"Face discomfort with curiosity; courage grows with use.",
	},
	{
		key: "EXCELLENCE",
		label: "Excellence",
		color: "#A21CAF",
		description:
			"Pursue craft, not perfection; raise the bar with intention.",
	},
	{
		key: "FORESIGHT",
		label: "Foresight",
		color: "#16A34A",
		description:
			"Anticipate, simulate, and design the future you prefer.",
	},
	{
		key: "CHARACTER",
		label: "Character",
		color: "#DC2626",
		description:
			"Do the right thing especially when unseen.",
	},
	{
		key: "HUMILITY",
		label: "Humility",
		color: "#0EA5E9",
		description:
			"Stay a student; let reality be the teacher.",
	},
];

export function getPrincipleByIndex(index: number) {
	const normalized = ((index % PRINCIPLES.length) + PRINCIPLES.length) % PRINCIPLES.length;
	return PRINCIPLES[normalized];
}

export function weekIndexFromStart(startDateIso: string, now: Date = new Date()) {
	const start = new Date(startDateIso);
	const diffMs = now.getTime() - start.getTime();
	const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
	return weeks % PRINCIPLES.length;
}

