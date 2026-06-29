import Image from "next/image";
import { CalendarDays, CakeSlice, Gift, HeartHandshake, Send, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export default function EventsPage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <section className="event-hero">
        <Image src="/assets/gallery/cakes/image_128.jpg" alt="Patisserie for events" fill priority />
        <div className="container event-hero-copy">
          <p className="kicker">Vos evenements</p>
          <h1>Mariages, baptemes, anniversaires</h1>
          <p className="hero-copy">
            Gateaux, tartes, plateaux gourmands et creations personnalisees pour les moments que l'on veut rendre beaux.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <h2>Des creations pour recevoir</h2>
            <p>Une page pensee pour transformer les demandes speciales en commandes simples a comprendre.</p>
          </div>
          <div className="category-grid">
            <article className="card contact-box">
              <CakeSlice size={32} aria-hidden="true" />
              <h3>Gateaux d'anniversaire</h3>
              <p>Formats, parfums, message, decor et nombre de personnes.</p>
            </article>
            <article className="card contact-box">
              <HeartHandshake size={32} aria-hidden="true" />
              <h3>Mariages et baptemes</h3>
              <p>Pieces a partager, tartes, douceurs individuelles et plateaux.</p>
            </article>
            <article className="card contact-box">
              <Gift size={32} aria-hidden="true" />
              <h3>Entreprises et familles</h3>
              <p>Commandes groupees, reunions, fetes, brunchs et receptions.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="split-showcase">
        <div className="container split-inner">
          <div className="pastry-mosaic">
            <Image src="/assets/gallery/cakes/image_128.jpg" alt="Event dessert display" width={520} height={680} />
            <Image src="/assets/gallery/cakes/image_131.jpg" alt="Fine pastry" width={360} height={420} />
            <Image src="/assets/gallery/shop/image_135.jpg" alt="Celebration dessert" width={360} height={420} />
          </div>
          <form className="card contact-box form-grid">
            <p className="kicker">Demande speciale</p>
            <h2>Preparer une commande</h2>
            <input aria-label="Name" placeholder="Nom" />
            <input aria-label="Phone" placeholder="Telephone" />
            <select aria-label="Event type" defaultValue="">
              <option value="" disabled>Type d'evenement</option>
              <option>Anniversaire</option>
              <option>Mariage</option>
              <option>Bapteme</option>
              <option>Commande entreprise</option>
            </select>
            <input aria-label="Event date" placeholder="Date souhaitee" />
            <textarea aria-label="Details" placeholder="Nombre de personnes, parfums, couleurs, message..." />
            <button className="button gold" type="button">
              <Send size={18} aria-hidden="true" />
              Envoyer la demande
            </button>
          </form>
        </div>
      </section>

      <section className="band">
        <div className="container">
          <div className="category-grid">
            <article className="card contact-box">
              <CalendarDays size={30} aria-hidden="true" />
              <h3>Anticiper la date</h3>
              <p>La demande peut indiquer la date, l'heure, le nombre de personnes et le budget.</p>
            </article>
            <article className="card contact-box">
              <Sparkles size={30} aria-hidden="true" />
              <h3>Personnaliser</h3>
              <p>Decor, inscription, format, parfums et inspirations peuvent etre precises.</p>
            </article>
            <article className="card contact-box">
              <Gift size={30} aria-hidden="true" />
              <h3>Retrait boutique</h3>
              <p>La commande est confirmee avec l'equipe avant preparation.</p>
            </article>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
