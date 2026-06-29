import Image from "next/image";
import Link from "next/link";
import { CakeSlice, ChefHat, HeartHandshake, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { business } from "@/lib/business";

const pillars = [
  {
    Icon: CakeSlice,
    title: "Patisserie signature",
    copy: "Des pieces soignées, visuelles et gourmandes pour les clients qui veulent une vraie vitrine artisanale."
  },
  {
    Icon: ChefHat,
    title: "Boulangerie du quotidien",
    copy: "Du pain, du salé, des viennoiseries et des pauses rapides pour faire vivre la boutique toute la journée."
  },
  {
    Icon: HeartHandshake,
    title: "Service attentionné",
    copy: "Un accueil simple et chaleureux, avec des commandes événementielles pensées pour rassurer et simplifier."
  }
];

const milestones = [
  "Produits frais préparés avec soin",
  "Boutique pensée pour les envies rapides",
  "Commandes sur mesure pour vos événements",
  "Une identité visuelle claire et premium"
];

export default function AboutPage() {
  return (
    <main className="site-shell">
      <SiteNav />

      <section className="about-hero" data-reveal>
        <div className="container about-hero-grid">
          <div className="about-hero-copy" data-reveal>
            <p className="kicker">A propos</p>
            <h1>Une maison gourmande, elegante et facile a aimer.</h1>
            <p className="hero-copy">
              L'Eclair de Calais met en avant des produits artisanaux, une vitrine claire et une experience client simple a comprendre, du premier regard jusqu'a la commande.
            </p>
            <div className="hero-actions">
              <Link className="button gold" href="/contact">
                <Sparkles size={18} aria-hidden="true" />
                Nous contacter
              </Link>
              <Link className="button secondary" href="/menu">
                Voir le menu
              </Link>
            </div>
          </div>

          <article className="about-hero-card" data-reveal>
            <Image src="https://xtlchcjaksrnijakmnfv.supabase.co/storage/v1/object/public/media/assets/gallery/cakes/image_81.jpg" alt="Bakery display" fill priority />
          </article>
        </div>
      </section>

      <section className="about-story" data-reveal>
        <div className="container about-story-grid">
          <div>
            <p className="kicker">Notre approche</p>
            <h2>Une boutique pensee pour paraitre premium, mais rester tres humaine.</h2>
            <p>
              Nous avons voulu une page qui donne confiance tout de suite: des textes courts, des blocs bien espacés, des images appetissantes et une lecture facile sur mobile comme sur desktop.
            </p>
            <ul className="about-list">
              {milestones.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="about-aside">
            <article className="card about-note" data-reveal>
              <p className="kicker">Maison de Calais</p>
              <h3>{business.name}</h3>
              <p>{business.address}</p>
            </article>
            <article className="card about-note accent" data-reveal>
              <p className="kicker">Horaires</p>
              <h3>Ouvert pour vos envies du quotidien</h3>
              <p>Des horaires clairs, une boutique lisible, et une offre pensee pour les pauses, les commandes et les grands moments.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-pillars" data-reveal>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Ce qui nous distingue</p>
              <h2>Une experience simple, nette et savoureuse.</h2>
            </div>
            <p>Un mix de gourmandise, de clarté et de douceur visuelle pour que le site parle bien aux clients.</p>
          </div>
          <div className="pillars-grid">
            {pillars.map(({ Icon, title, copy }) => (
              <article className="card pillar-card" key={title} data-reveal>
                <span className="pillar-icon">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta" data-reveal>
        <div className="container about-cta-inner">
          <div>
            <p className="kicker">Envie d'en savoir plus ?</p>
            <h2>Venez voir la boutique, la carte et les creations du moment.</h2>
          </div>
          <Link className="button gold" href="/contact">
            Prendre contact
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
