import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false }
});

async function main() {
  const map = JSON.parse(
    await readFile(path.join(process.cwd(), "scripts", "asset-url-map.json"), "utf8")
  );

  const { data: categories, error: catErr } = await supabase.from("categories").select("id, image");
  if (catErr) throw catErr;
  for (const row of categories) {
    const newUrl = map[row.image];
    if (newUrl && newUrl !== row.image) {
      const { error } = await supabase.from("categories").update({ image: newUrl }).eq("id", row.id);
      if (error) throw error;
      console.log(`category ${row.id}: ${row.image} -> ${newUrl}`);
    }
  }

  const { data: items, error: itemErr } = await supabase.from("menu_items").select("id, image");
  if (itemErr) throw itemErr;
  for (const row of items) {
    const newUrl = map[row.image];
    if (newUrl && newUrl !== row.image) {
      const { error } = await supabase.from("menu_items").update({ image: newUrl }).eq("id", row.id);
      if (error) throw error;
      console.log(`item ${row.id}: ${row.image} -> ${newUrl}`);
    }
  }

  const { data: gallery, error: galErr } = await supabase.from("gallery_images").select("id, url");
  if (galErr) throw galErr;
  for (const row of gallery) {
    const newUrl = map[row.url];
    if (newUrl && newUrl !== row.url) {
      const { error } = await supabase.from("gallery_images").update({ url: newUrl }).eq("id", row.id);
      if (error) throw error;
      console.log(`gallery ${row.id}: ${row.url} -> ${newUrl}`);
    }
  }

  console.log("DB image URLs updated.");
}

main().catch((error) => {
  console.error("Update failed:", error);
  process.exit(1);
});
