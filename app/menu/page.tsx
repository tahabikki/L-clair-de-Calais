"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { MenuCard } from "@/components/MenuCard";
import { SiteNav } from "@/components/SiteNav";
import type { MenuItem } from "@/components/MenuCard";

interface Category {
  id: string;
  name: string;
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

  useEffect(() => {
    fetch("/api/content")
      .then((response) => response.json())
      .then((data: ContentData) => {
        const visible = data.categories.filter((category) => category.visible);
        setContent(data);
        setActive(visible[0]?.id || "");
      });
  }, []);

  const categories = content.categories.filter((category) => category.visible).sort((a, b) => a.order - b.order);
  const items = content.items
    .filter((item) => item.categoryId === active)
    .sort((a, b) => a.order - b.order);
  const featuredItems = content.items
    .filter((item) => item.featured)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="site-shell">
      <SiteNav />
      <section>
        <div className="container">
          <div className="section-head">
            <h2>Menu</h2>
            <p>Parcourez les categories du fournil. Les images et les prix sont gerees depuis le panneau admin.</p>
          </div>
          {featuredItems.length ? (
            <>
              <h3 style={{ margin: "0 0 18px", fontSize: "1.35rem" }}>Meilleures offres</h3>
              <div className="featured-grid" style={{ marginBottom: 36 }}>
                {featuredItems.slice(0, 4).map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </>
          ) : null}
          <div className="menu-layout">
            <aside className="tabs" aria-label="Menu categories">
              {categories.map((category) => (
                <button
                  className={`tab ${active === category.id ? "active" : ""}`}
                  key={category.id}
                  onClick={() => setActive(category.id)}
                  type="button"
                >
                  {category.name}
                </button>
              ))}
            </aside>
            <div className="menu-grid">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
