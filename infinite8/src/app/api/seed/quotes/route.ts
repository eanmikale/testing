import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Principle, QuoteSourceType } from "@/generated/prisma";

export async function POST() {
	const data = [
		{ text: "Well done is better than well said.", author: "Benjamin Franklin", principle: "EXCELLENCE" },
		{ text: "Energy and persistence conquer all things.", author: "Benjamin Franklin", principle: "PERSISTENCE" },
		{ text: "He that cannot obey, cannot command.", author: "Benjamin Franklin", principle: "SELF_DISCIPLINE" },
		{ text: "By failing to prepare, you are preparing to fail.", author: "Benjamin Franklin", principle: "FORESIGHT" },
		{ text: "Only those who dare to fail greatly can ever achieve greatly.", author: "Robert F. Kennedy", principle: "FEARLESSNESS" },
		{ text: "Character is destiny.", author: "Heraclitus", principle: "CHARACTER" },
		{ text: "True knowledge exists in knowing that you know nothing.", author: "Socrates", principle: "HUMILITY" },
		{ text: "You are responsible for your life.", author: "Oprah Winfrey", principle: "SELF_RESPONSIBILITY" },
	];
	await prisma.quote.createMany({ data: data.map((d) => ({ text: d.text, author: d.author, principle: Principle[d.principle as keyof typeof Principle], sourceType: QuoteSourceType.PUBLIC })) });
	return NextResponse.json({ ok: true });
}