import Link from "next/link";
import Image from "next/image";
import { Facebook, Home, Image as ImageIcon, Mail, MapPin, Phone, ShoppingBag, Sparkles } from "lucide-react";
import { business } from "@/lib/business";

export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/assets/logo/logo.png" alt={business.name} width={120} height={120} />
          <p>
            Une maison de patisserie et boulangerie a Calais, avec des produits frais, des commandes speciales,
            et une vitrine claire pour les clients.
          </p>
          <a className="footer-link" href={`tel:${business.phone.replaceAll(" ", "")}`}>
            <Phone size={18} aria-hidden="true" />
            {business.phone}
          </a>
        </div>

        <div className="footer-column">
          <h3>Pages</h3>
          <nav className="footer-nav" aria-label="Footer navigation">
            <Link className="footer-link" href="/">
              <Home size={18} aria-hidden="true" />
              Accueil
            </Link>
            <Link className="footer-link" href="/menu">
              <ShoppingBag size={18} aria-hidden="true" />
              Menu
            </Link>
            <Link className="footer-link" href="/gallery">
              <ImageIcon size={18} aria-hidden="true" />
              Galerie
            </Link>
            <Link className="footer-link" href="/vos-evenements">
              <Sparkles size={18} aria-hidden="true" />
              Vos evenements
            </Link>
          </nav>
        </div>

        <div className="footer-column">
          <h3>Contact et horaires</h3>
          <div className="footer-nav">
            <a className="footer-link" href={business.mapUrl} target="_blank" rel="noreferrer">
              <MapPin size={18} aria-hidden="true" />
              {business.address}
            </a>
            <a className="footer-link" href={`mailto:${business.email}`}>
              <Mail size={18} aria-hidden="true" />
              {business.email}
            </a>
            <a className="footer-link" href={business.facebook} target="_blank" rel="noreferrer">
              <Facebook size={18} aria-hidden="true" />
              Facebook
            </a>
          </div>
          <div className="footer-hours" style={{ marginTop: 18 }}>
            {business.hours.map(([day, hours]: [string, string]) => (
              <div key={day}>
                <span>{day}</span>
                <strong>{hours}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{business.name}</span>
        <span>Calais, France</span>
      </div>
    </footer>
  );
}
