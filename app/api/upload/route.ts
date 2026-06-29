import { promises as fs } from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploadPath = path.join(uploadDir, safeName);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(uploadPath, buffer);

  return NextResponse.json({ path: `/uploads/${safeName}` });
}
