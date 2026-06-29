import Image from "next/image";
import Link from "next/link";
import { BookOpen, Cake, ChefHat, Gift, MapPin, Package, ShoppingBag, Wheat } from "lucide-react";
import { Footer } from "@/components/Footer";
import { MenuCard } from "@/components/MenuCard";
import { SiteNav } from "@/components/SiteNav";
import { business } from "@/lib/business";
import { getContent } from "@/lib/content";

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Package, ShoppingBag, Wheat, Cake, ChefHat, BookOpen
};

export default async function HomePage() {
  const content = await getContent();
  const featured = content.items.filter((item: any) => item.featured).slice(0, 4);
  const discover = (content.discover ?? []).map((d) => ({
    ...d,
    icon: iconMap[d.icon] ?? Package
  }));
  const heroImages = content.gallery?.length
    ? content.gallery.slice(0, 6).map((src) => ({ src, alt: "Bakery display" }))
    : [];
  const testimonials = content.testimonials ?? [];

  return (
    <main className="site-shell">
      <SiteNav />
      <section className="hero">
        <div className="container hero-content" data-reveal>
          <p className="kicker">Patisserie & boulangerie a Calais</p>
          <h1>
            Des <span className="h1-accent">douceurs</span> qui donnent envie avant meme la premiere bouchee.
          </h1>
          <p className="hero-copy">
            Eclairs, viennoiseries, tartes, sandwichs, pizzas et gateaux d'evenement prepares pour les beaux moments du quotidien.
          </p>
          <div className="hero-actions">
            <Link className="button gold" href="/menu">
              <ShoppingBag size={18} aria-hidden="true" />
              Commander maintenant
            </Link>
            <Link className="button secondary" href="/vos-evenements">
              <Gift size={18} aria-hidden="true" />
              Vos evenements
            </Link>
          </div>
        </div>

        <div className="hero-gallery" aria-label="Bakery highlights" data-reveal>
          <div className="hero-gallery-track" aria-hidden="true">
            {[...heroImages, ...heroImages].map((image, index) => (
              <article className="hero-gallery-card" key={`${image.src}-${index}`}>
                <Image src={image.src} alt={image.alt} fill priority={index < 2} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="discover-section" data-reveal>
        <div className="container">
          <h2 className="center-title">Decouvrez ce que la maison prepare pour vous</h2>
          <div className="discover-grid">
            {discover.map(({ id, label, href, icon: Icon }) => (
              <Link className="discover-item" href={href} key={id} data-reveal>
                <span className="discover-icon" aria-hidden="true">
                  <Icon size={48} strokeWidth={1.2} />
                </span>
                <strong>{label}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal>
        <div className="container">
          <div className="section-head">
            <h2>Les incontournables</h2>
            <p>Une selection gourmande pour montrer tout de suite que l'adresse vit autour du pain, du feuilletage et de la patisserie.</p>
          </div>
          <div className="featured-grid">
            {featured.map((item: any) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="split-showcase" data-reveal>
        <div className="container split-inner">
          <div className="split-copy" data-reveal>
            <p className="kicker">Savoir-faire maison</p>
            <h2>Une vitrine chaude, genereuse, vraiment patisserie.</h2>
            <p>
              La page d'accueil met en avant les produits reels, les textures, les vitrines et les commandes speciales pour donner envie avant meme d'arriver en boutique.
            </p>
            <Link className="button gold" href="/gallery">
              Voir la galerie
            </Link>
          </div>
          <div className="pastry-mosaic" aria-label="Bakery image selection" data-reveal>
            <Image src="/assets/gallery/image_128.jpg" alt="Patisserie selection" width={520} height={680} />
            <Image src="/assets/gallery/image_100.jpg" alt="Fresh pastry closeup" width={360} height={420} />
            <Image src="/assets/gallery/image_81.jpg" alt="Bakery display" width={360} height={420} />
          </div>
        </div>
      </section>

      <section className="testimonials-section" data-reveal>
        <div className="container">
          <div className="section-head testimonials-head">
            <div>
              <p className="kicker">Avis clients</p>
              <h2>Ce que disent nos clients</h2>
            </div>
            <p>Des retours simples et rassurants pour montrer la qualite, l'accueil et les commandes de la maison.</p>
          </div>
          <div className="testimonials-viewport">
            <div className="testimonials-grid">
              {[...testimonials, ...testimonials].map((item, index) => (
                <article className="testimonial-card" key={`${item.name}-${index}`} data-reveal>
                  <span className="testimonial-badge">
                    <Image src="/assets/logo/logo.png" alt="" width={60} height={60} />
                  </span>
                  <p className="testimonial-quote">"{item.quote}"</p>
                  <div className="testimonial-stars" aria-label={`${item.rating} sur 5`}>
                    {"*****".slice(0, item.rating)}
                  </div>
                  <strong>{item.name}</strong>
                  <span>{item.city}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="testimonial-stats">
            <article className="testimonial-stat" data-reveal>
              <strong data-count="5000" data-count-suffix="+">0</strong>
              <span>clients satisfaits</span>
            </article>
            <article className="testimonial-stat" data-reveal>
              <strong data-count="4.9" data-count-suffix="/5">0</strong>
              <span>note moyenne</span>
            </article>
            <article className="testimonial-stat" data-reveal>
              <strong data-count="100" data-count-suffix="%">0</strong>
              <span>artisanal</span>
            </article>
          </div>
        </div>
      </section>

      <section className="events-strip" data-reveal>
        <div className="container events-home">
          <Image src="/assets/gallery/cakes/image_128.jpg" alt="Celebration pastries" width={720} height={540} />
          <div>
            <p className="kicker">Mariages, baptemes, anniversaires</p>
            <h2>Vos evenements ont leur page dediee.</h2>
            <p>
              Une section claire pour demander un gateau, un buffet sucre, des plateaux ou une piece personnalisee.
            </p>
            <Link className="button" href="/vos-evenements">
              Preparer un evenement
            </Link>
          </div>
        </div>
      </section>

      <section className="band" data-reveal>
        <div className="container">
          <div className="section-head">
            <h2>Pour chaque moment</h2>
            <p>Le site guide les clients vers les envies rapides, les pauses de midi, et les grandes commandes a preparer avec la boulangerie.</p>
          </div>
          <div className="category-grid">
            <article className="card contact-box">
              <Gift size={28} aria-hidden="true" />
              <h3>Anniversaires</h3>
              <p>Gateaux personnalises, tartes, plateaux et douceurs pour les fetes.</p>
            </article>
            <article className="card contact-box">
              <ChefHat size={28} aria-hidden="true" />
              <h3>Pause salee</h3>
              <p>Sandwichs, pizzas et formules simples pour les clients presses.</p>
            </article>
            <article className="card contact-box">
              <MapPin size={28} aria-hidden="true" />
              <h3>A Calais</h3>
              <p>{business.address}</p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
