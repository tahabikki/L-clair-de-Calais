import { NextResponse, NextRequest } from "next/server";
import { supabase, MEDIA_BUCKET } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(safeName, buffer, {
    contentType: file.type || "application/octet-stream"
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(safeName);

  return NextResponse.json({ path: data.publicUrl });
}
