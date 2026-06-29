import { NextResponse, NextRequest } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import type { Content } from "@/lib/content";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(request: NextRequest) {
  const content: Content = await request.json();
  await saveContent(content);
  return NextResponse.json({ ok: true, content });
}
