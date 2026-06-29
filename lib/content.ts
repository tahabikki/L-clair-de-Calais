import { supabase } from "@/lib/supabaseClient";

export interface ContentItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  available: boolean;
  tag?: string;
  featured?: boolean;
  categoryId?: string;
  order?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  order: number;
  visible: boolean;
}

export interface DiscoverItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  city: string;
  rating: number;
}

export interface Content {
  items: ContentItem[];
  categories?: Category[];
  gallery?: string[];
  discover?: DiscoverItem[];
  testimonials?: Testimonial[];
}

const discover: DiscoverItem[] = [
  { id: "nouveautes", label: "Nouveautes", href: "/menu", icon: "Package" },
  { id: "commander", label: "Commander", href: "/menu", icon: "ShoppingBag" },
  { id: "boulangerie", label: "Boulangerie", href: "/menu", icon: "Wheat" },
  { id: "patisserie", label: "Patisserie", href: "/menu", icon: "Cake" },
  { id: "evenements", label: "Evenements", href: "/vos-evenements", icon: "ChefHat" },
  { id: "catalogue", label: "Catalogue", href: "/gallery", icon: "BookOpen" }
];

export async function getContent(): Promise<Content> {
  const [categoriesRes, itemsRes, galleryRes, testimonialsRes] = await Promise.all([
    supabase.from("categories").select("*").order("order"),
    supabase.from("menu_items").select("*").order("order"),
    supabase.from("gallery_images").select("url").order("created_at"),
    supabase.from("testimonials").select("*")
  ]);

  if (categoriesRes.error) throw categoriesRes.error;
  if (itemsRes.error) throw itemsRes.error;
  if (galleryRes.error) throw galleryRes.error;
  if (testimonialsRes.error) throw testimonialsRes.error;

  const items: ContentItem[] = (itemsRes.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    price: row.price,
    available: row.available,
    tag: row.tag,
    featured: row.featured,
    categoryId: row.category_id,
    order: row.order
  }));

  return {
    categories: (categoriesRes.data ?? []) as Category[],
    items,
    gallery: (galleryRes.data ?? []).map((row) => row.url),
    discover,
    testimonials: (testimonialsRes.data ?? []) as Testimonial[]
  };
}

export async function saveContent(content: Content): Promise<Content> {
  const categories = content.categories ?? [];
  const items = content.items ?? [];
  const gallery = content.gallery ?? [];

  if (categories.length > 0) {
    const { error } = await supabase.from("categories").upsert(
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        image: category.image,
        order: category.order,
        visible: category.visible
      }))
    );
    if (error) throw error;
  }

  const incomingCategoryIds = categories.map((category) => category.id);
  const { data: existingCategories, error: existingCategoryError } = await supabase
    .from("categories")
    .select("id");
  if (existingCategoryError) throw existingCategoryError;

  const categoryIdsToDelete = (existingCategories ?? [])
    .map((row) => row.id as string)
    .filter((id) => !incomingCategoryIds.includes(id));

  if (categoryIdsToDelete.length > 0) {
    const { error } = await supabase.from("categories").delete().in("id", categoryIdsToDelete);
    if (error) throw error;
  }

  const itemRows = items.map((item) => ({
    id: item.id,
    category_id: item.categoryId,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    tag: item.tag,
    featured: item.featured ?? false,
    available: item.available ?? true,
    order: item.order ?? 99
  }));

  if (itemRows.length > 0) {
    const { error } = await supabase.from("menu_items").upsert(itemRows);
    if (error) throw error;
  }

  const incomingIds = items.map((item) => item.id);
  const { data: existingItems, error: existingError } = await supabase.from("menu_items").select("id");
  if (existingError) throw existingError;

  const idsToDelete = (existingItems ?? [])
    .map((row) => row.id as string)
    .filter((id) => !incomingIds.includes(id));

  if (idsToDelete.length > 0) {
    const { error } = await supabase.from("menu_items").delete().in("id", idsToDelete);
    if (error) throw error;
  }

  const { error: clearGalleryError } = await supabase.from("gallery_images").delete().neq("id", -1);
  if (clearGalleryError) throw clearGalleryError;

  if (gallery.length > 0) {
    const { error } = await supabase.from("gallery_images").insert(gallery.map((url) => ({ url })));
    if (error) throw error;
  }

  return getContent();
}
