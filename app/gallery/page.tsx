import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { GalleryTabs } from "@/components/GalleryTabs";
import { supabase, MEDIA_BUCKET } from "@/lib/supabaseClient";

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const videoExtensions = [".mp4", ".webm", ".mov"];

function publicUrl(storagePath: string): string {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

function hasExtension(name: string, exts: string[]): boolean {
  return exts.some((ext) => name.toLowerCase().endsWith(ext));
}

async function listFiles(prefix: string, exts: string[]): Promise<string[]> {
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(prefix, { limit: 1000 });
  if (error || !data) return [];
  return data
    .filter((entry) => entry.id !== null && hasExtension(entry.name, exts))
    .map((entry) => publicUrl(`${prefix}/${entry.name}`))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function getGalleryData() {
  const galleryPrefix = "assets/gallery";
  const { data: entries, error } = await supabase.storage.from(MEDIA_BUCKET).list(galleryPrefix, { limit: 1000 });
  if (error || !entries) return { rootImages: [], categories: [] };

  const subdirs = entries.filter((entry) => entry.id === null);
  const rootImages = await listFiles(galleryPrefix, imageExtensions);

  const categories = await Promise.all(
    subdirs.map(async (dir) => {
      const images = await listFiles(`${galleryPrefix}/${dir.name}`, imageExtensions);
      return { label: dir.name.charAt(0).toUpperCase() + dir.name.slice(1), images };
    })
  );

  return { rootImages, categories };
}

async function getVideos(): Promise<string[]> {
  return listFiles("assets/videos", videoExtensions);
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
