import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false }
});

async function main() {
  const raw = await readFile(path.join(process.cwd(), "data", "content.json"), "utf8");
  const content = JSON.parse(raw);

  console.log(`Migrating ${content.categories.length} categories...`);
  const { error: catError } = await supabase.from("categories").upsert(
    content.categories.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      order: c.order,
      visible: c.visible
    }))
  );
  if (catError) throw catError;

  console.log(`Migrating ${content.items.length} menu items...`);
  const { error: itemError } = await supabase.from("menu_items").upsert(
    content.items.map((i) => ({
      id: i.id,
      category_id: i.categoryId,
      name: i.name,
      description: i.description,
      price: i.price,
      image: i.image,
      tag: i.tag,
      featured: i.featured ?? false,
      available: i.available ?? true,
      order: i.order ?? 99
    }))
  );
  if (itemError) throw itemError;

  console.log(`Migrating ${content.gallery.length} gallery images...`);
  await supabase.from("gallery_images").delete().neq("id", -1);
  const { error: galleryError } = await supabase
    .from("gallery_images")
    .insert(content.gallery.map((url) => ({ url })));
  if (galleryError) throw galleryError;

  console.log(`Migrating ${content.testimonials.length} testimonials...`);
  await supabase.from("testimonials").delete().neq("id", -1);
  const { error: testimonialError } = await supabase.from("testimonials").insert(
    content.testimonials.map((t) => ({
      quote: t.quote,
      name: t.name,
      city: t.city,
      rating: t.rating
    }))
  );
  if (testimonialError) throw testimonialError;

  console.log("Migration complete.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
