import { NextResponse } from "next/server";
import { analyzePronunciation } from "@/lib/analysis";

export async function POST(request: Request) {
  const form = await request.formData();
  const audio = form.get("audio");
  const passageId = String(form.get("passageId") ?? "");
  if (!(audio instanceof Blob)) return NextResponse.json({ error: "Missing audio" }, { status: 400 });
  return NextResponse.json(await analyzePronunciation(audio, passageId));
}
