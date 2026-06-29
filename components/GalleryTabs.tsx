"use client";

import { useState } from "react";
import Image from "next/image";

interface Category {
  label: string;
  images: string[];
}

interface Props {
  allImages: string[];
  categories: Category[];
}

export function GalleryTabs({ allImages, categories }: Props) {
  const tabs = [{ label: "Tout", images: allImages }, ...categories];
  const [active, setActive] = useState(tabs[0].label);
  const current = tabs.find((t) => t.label === active) ?? tabs[0];

  return (
    <>
      <div className="gallery-tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`gallery-tab ${active === tab.label ? "active" : ""}`}
            onClick={() => setActive(tab.label)}
          >
            {tab.label}
            <span className="gallery-tab-count">{tab.images.length}</span>
          </button>
        ))}
      </div>
      <div className="gallery-album">
        {current.images.map((image, index) => (
          <article className={`gallery-album-item item-${index % 11}`} key={image}>
            <Image src={image} alt="L'Eclair de Calais gallery item" fill sizes="(max-width: 900px) 50vw, 25vw" />
          </article>
        ))}
      </div>
    </>
  );
}
