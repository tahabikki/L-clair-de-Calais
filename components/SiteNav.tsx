"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { business } from "@/lib/business";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Galerie" },
  { href: "/about", label: "Maison" },
  { href: "/vos-evenements", label: "Vos evenements" },
  { href: "/contact", label: "Contact" }
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const phoneHref = `tel:${business.phone.replaceAll(" ", "")}`;

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/" aria-label="L'Eclair de Calais home" onClick={() => setOpen(false)}>
          <Image
            src="https://xtlchcjaksrnijakmnfv.supabase.co/storage/v1/object/public/media/assets/logo/logo.png"
            alt="L'Eclair de Calais logo"
            width={64}
            height={64}
            priority
          />
        </Link>

        <nav className="nav-links nav-desktop" aria-label="Main navigation">
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="button nav-call" href={phoneHref}>
            <Phone size={18} aria-hidden="true" />
            Appeler
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={`nav-mobile-panel ${open ? "open" : ""}`}>
        <div className="container">
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <a className="button gold" href={phoneHref} onClick={() => setOpen(false)}>
            <Phone size={18} aria-hidden="true" />
            Appeler
          </a>
        </div>
      </div>
    </header>
  );
}
