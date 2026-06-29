"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { MenuCard } from "@/components/MenuCard";
import { SiteNav } from "@/components/SiteNav";
import type { MenuItem } from "@/components/MenuCard";

interface Category {
  id: string;
  name: string;
  image: string;
  visible: boolean;
  order: number;
}

interface ContentData {
  categories: Category[];
  items: MenuItem[];
}

export default function MenuPage() {
  const [content, setContent] = useState<ContentData>({ categories: [], items: [] });
  const [active, setActive] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-data")
      .then((response) => response.json())
      .then((data: ContentData) => {
        const visible = data.categories.filter((category) => category.visible);
        setContent(data);
        setActive(visible[0]?.id || "");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const categories = content.categories.filter((category) => category.visible).sort((a, b) => a.order - b.order);
  const items = content.items
    .filter((item) => item.categoryId === active)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const featuredItems = content.items
    .filter((item) => item.featured)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    content.items.forEach((item) => {
      if (!item.categoryId) return;
      map[item.categoryId] = (map[item.categoryId] || 0) + 1;
    });
    return map;
  }, [content.items]);

  return (
    <main className="site-shell">
      <SiteNav />
      <section>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Carte maison</p>
              <h2>Menu</h2>
              <p>
                {loading
                  ? "Chargement du menu..."
                  : `${content.items.length} produits, mis a jour en direct depuis le panneau admin.`}
              </p>
            </div>
          </div>

          {featuredItems.length ? (
            <>
              <h3 style={{ margin: "0 0 18px", fontSize: "1.35rem" }}>Meilleures offres</h3>
              <div className="featured-grid" style={{ marginBottom: 48 }}>
                {featuredItems.slice(0, 4).map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </>
          ) : null}

          <div className="menu-layout">
            <nav className="menu-tab-bar" aria-label="Menu categories">
              {categories.map((category) => (
                <button
                  className={`tab menu-tab ${active === category.id ? "active" : ""}`}
                  key={category.id}
                  onClick={() => setActive(category.id)}
                  type="button"
                >
                  {category.image ? (
                    <Image className="menu-tab-thumb" src={category.image} alt="" width={32} height={32} />
                  ) : null}
                  {category.name}
                  <span className="menu-tab-count">{counts[category.id] || 0}</span>
                </button>
              ))}
            </nav>

            <div className="menu-grid">
              {items.length ? (
                items.map((item) => <MenuCard key={item.id} item={item} />)
              ) : !loading ? (
                <p style={{ color: "var(--muted)", fontFamily: "Trebuchet MS, sans-serif" }}>
                  Aucun produit dans cette categorie pour le moment.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
