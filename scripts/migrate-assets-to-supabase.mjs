import { createClient } from "@supabase/supabase-js";
import { readFile, readdir, writeFile } from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false }
});

const BUCKET = "media";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const ASSETS_DIR = path.join(PUBLIC_DIR, "assets");

const contentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime"
};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      return [fullPath];
    })
  );
  return files.flat();
}

async function main() {
  const files = await walk(ASSETS_DIR);
  console.log(`Found ${files.length} files under public/assets`);

  const map = {};

  for (const filePath of files) {
    const relative = path.relative(PUBLIC_DIR, filePath).replaceAll(path.sep, "/");
    const oldUrlPath = `/${relative}`;
    const storagePath = relative;
    const ext = path.extname(filePath).toLowerCase();
    const buffer = await readFile(filePath);

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
      contentType: contentTypes[ext] || "application/octet-stream",
      upsert: true
    });

    if (error) {
      console.error(`Failed: ${storagePath} -> ${error.message}`);
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    map[oldUrlPath] = data.publicUrl;
    console.log(`Uploaded ${storagePath}`);
  }

  await writeFile(
    path.join(process.cwd(), "scripts", "asset-url-map.json"),
    JSON.stringify(map, null, 2),
    "utf8"
  );

  console.log(`\nDone. Mapped ${Object.keys(map).length} files. Written to scripts/asset-url-map.json`);
}

main().catch((error) => {
  console.error("Asset migration failed:", error);
  process.exit(1);
});
