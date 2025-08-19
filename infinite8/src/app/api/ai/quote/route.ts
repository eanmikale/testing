import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const principle = searchParams.get("principle") ?? "SELF_DISCIPLINE";
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		return NextResponse.json({ text: `Practice ${principle} with a small action today.`, author: "Infinite 8 AI", sourceType: "AI" });
	}
	const openai = new OpenAI({ apiKey });
	const prompt = `Write a concise, original motivational quote (max 20 words) about ${principle.replaceAll("_"," ")}.`;
	const resp = await openai.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.8 });
	const text = resp.choices[0]?.message?.content?.trim() || `Lean into ${principle.toLowerCase()}.`;
	return NextResponse.json({ text, author: "Infinite 8 AI", sourceType: "AI" });
}

