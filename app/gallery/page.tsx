import { promises as fs } from "fs";
import path from "path";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { GalleryTabs } from "@/components/GalleryTabs";

const extensions = [".jpg", ".jpeg", ".png", ".webp"];

async function listFiles(dir: string, exts: string[]): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (e) => {
      if (e.isDirectory()) return [];
      if (!exts.includes(path.extname(e.name).toLowerCase())) return [];
      const full = path.join(dir, e.name);
      return [`/${path.relative(path.join(process.cwd(), "public"), full).replaceAll(path.sep, "/")}`];
    })
  );
  return files.flat().sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function getGalleryData() {
  const galleryDir = path.join(process.cwd(), "public", "assets", "gallery");
  const subdirs = (await fs.readdir(galleryDir, { withFileTypes: true })).filter((e) => e.isDirectory());

  const rootImages = await listFiles(galleryDir, extensions);

  const categories = await Promise.all(
    subdirs.map(async (d) => {
      const images = await listFiles(path.join(galleryDir, d.name), extensions);
      return { label: d.name.charAt(0).toUpperCase() + d.name.slice(1), images };
    })
  );

  return { rootImages, categories };
}

async function getVideos() {
  const dir = path.join(process.cwd(), "public", "assets", "videos");
  const exts = [".mp4", ".webm", ".mov"];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((e) => !e.isDirectory() && exts.includes(path.extname(e.name).toLowerCase()))
    .map((e) => `/assets/videos/${e.name}`);
}

function VideosSection({ videos }: { videos: string[] }) {
  if (!videos.length) return null;
  return (
    <section className="gallery-video-section" data-reveal>
      <div className="container">
        <div className="section-head">
          <h2>Videos</h2>
          <p>Des moments courts pour montrer le mouvement, la vitrine et les produits en boutique.</p>
        </div>
        <div className="gallery-video-grid">
          {videos.map((video) => (
            <video key={video} src={video} controls muted playsInline preload="metadata" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function GalleryPage() {
  const { rootImages, categories } = await getGalleryData();
  const allImages = [...rootImages, ...categories.flatMap((c) => c.images)];
  const videos = await getVideos();

  return (
    <main className="site-shell gallery-page">
      <SiteNav />
      <section className="gallery-hero" data-reveal>
        <div className="container">
          <p className="kicker">Galerie maison</p>
          <h1>Tout l'album gourmand de L'Eclair de Calais.</h1>
          <p className="hero-copy">
            Patisseries, vitrines, gateaux, viennoiseries et moments en boutique, organises comme un vrai album visuel.
          </p>
        </div>
      </section>

      <section className="gallery-album-section">
        <div className="container">
          <GalleryTabs allImages={allImages} categories={categories} />
        </div>
      </section>

      <VideosSection videos={videos} />

      <Footer />
    </main>
  );
}
