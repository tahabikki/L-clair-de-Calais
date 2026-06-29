import { promises as fs } from "fs";
import path from "path";

export interface ContentItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  available: boolean;
  tag?: string;
  featured?: boolean;
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
  categories?: any[];
  gallery?: string[];
  discover?: DiscoverItem[];
  testimonials?: Testimonial[];
}

const contentPath = path.join(process.cwd(), "data", "content.json");

export async function getContent(): Promise<Content> {
  const raw = await fs.readFile(contentPath, "utf8");
  return JSON.parse(raw);
}

export async function saveContent(content: Content): Promise<Content> {
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf8");
  return content;
}
