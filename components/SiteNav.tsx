import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { business } from "@/lib/business";

export function SiteNav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <nav className="nav-links nav-left" aria-label="Main navigation">
          <Link href="/">Accueil</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/gallery">Galerie</Link>
        </nav>
        <Link className="brand" href="/" aria-label="L'Eclair de Calais home">
          <Image src="https://xtlchcjaksrnijakmnfv.supabase.co/storage/v1/object/public/media/assets/logo/logo.png" alt="L'Eclair de Calais logo" width={180} height={180} priority />
        </Link>
        <nav className="nav-links nav-right" aria-label="Secondary navigation">
          <Link href="/about">Maison</Link>
          <Link href="/vos-evenements">Vos evenements</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <a className="button" href={`tel:${business.phone.replaceAll(" ", "")}`}>
          <Phone size={18} aria-hidden="true" />
          Appeler
        </a>
      </div>
    </header>
  );
}
