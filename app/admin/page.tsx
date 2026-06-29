"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, FormEvent, ChangeEvent } from "react";
import type { MenuItem } from "@/components/MenuCard";

interface Category {
  id: string;
  name: string;
  image: string;
  order: number;
  visible: boolean;
}

interface ContentData {
  categories: Category[];
  items: MenuItem[];
  gallery: string[];
}

const emptyItem: Omit<MenuItem, "id"> = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  image: "/assets/menu/patisseries/image_58.jpg",
  featured: false,
  available: true,
  tag: "",
  order: 99
};

const emptyCategory: Omit<Category, "id"> = {
  name: "",
  image: "/assets/gallery/shop/image_00.jpg",
  order: 99,
  visible: true
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AdminPage() {
  const [content, setContent] = useState<ContentData>({ categories: [], items: [], gallery: [] });
  const [itemForm, setItemForm] = useState<Omit<MenuItem, "id">>(emptyItem);
  const [categoryForm, setCategoryForm] = useState<Omit<Category, "id">>(emptyCategory);
  const [status, setStatus] = useState<string>("Loading content...");

  useEffect(() => {
    fetch("/api/content")
      .then((response) => response.json())
      .then((data: ContentData) => {
        setContent(data);
        setItemForm((form) => ({ ...form, categoryId: data.categories[0]?.id || "" }));
        setStatus("Ready");
      });
  }, []);

  const sortedItems = useMemo(() => [...content.items].sort((a, b) => (a.order || 0) - (b.order || 0)), [content.items]);
  const sortedCategories = useMemo(() => [...content.categories].sort((a, b) => a.order - b.order), [content.categories]);

  async function save(nextContent: ContentData = content): Promise<void> {
    setStatus("Saving...");
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextContent)
    });
    if (response.ok) {
      setStatus("Saved");
    } else {
      setStatus("Could not save");
    }
  }

  function addCategory(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!categoryForm.name.trim()) return;
    const nextCategory: Category = {
      ...categoryForm,
      id: slugify(categoryForm.name) || `category-${Date.now()}`
    };
    const nextContent = {
      ...content,
      categories: [...content.categories, nextCategory]
    };
    setContent(nextContent);
    setCategoryForm(emptyCategory);
    save(nextContent);
  }

  function addItem(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!itemForm.name.trim() || !itemForm.categoryId) return;
    const nextItem: MenuItem = {
      ...(itemForm as MenuItem),
      id: slugify(itemForm.name) || `item-${Date.now()}`
    };
    const nextContent = {
      ...content,
      items: [...content.items, nextItem]
    };
    setContent(nextContent);
    setItemForm({ ...emptyItem, categoryId: content.categories[0]?.id || "" });
    save(nextContent);
  }

  function deleteItem(id: string): void {
    const nextContent = {
      ...content,
      items: content.items.filter((item) => item.id !== id)
    };
    setContent(nextContent);
    save(nextContent);
  }

  function toggleItem(id: string, key: "available" | "featured"): void {
    const nextContent = {
      ...content,
      items: content.items.map((item) => (item.id === id ? { ...item, [key]: !item[key] } : item))
    };
    setContent(nextContent);
    save(nextContent);
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>, target: "item" | "category" = "item"): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (data.path) {
      if (target === "category") {
        setCategoryForm((form) => ({ ...form, image: data.path }));
      } else {
        setItemForm((form) => ({ ...form, image: data.path }));
      }
      setContent((current) => ({ ...current, gallery: [data.path, ...current.gallery] }));
      setStatus("Image uploaded");
    }
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Image src="/assets/logo/logo.png" alt="L'Eclair de Calais logo" width={112} height={112} />
        <h3>Back Office</h3>
        <p style={{ color: "rgba(255,255,255,.7)", fontFamily: "Trebuchet MS, sans-serif" }}>
          Simple editing space for menu categories, products, images, and availability.
        </p>
        <Link href="/">View website</Link>
        <Link href="/menu">View menu page</Link>
        <Link href="/gallery">View gallery</Link>
      </aside>

      <section className="admin-main">
        <div className="section-head">
          <div>
            <p className="kicker">Client admin</p>
            <h2>Menu manager</h2>
          </div>
          <button className="button" type="button" onClick={() => save()}>
            <Save size={18} aria-hidden="true" />
            Save all
          </button>
        </div>
        <p style={{ fontFamily: "Trebuchet MS, sans-serif", color: "var(--muted)" }}>Status: {status}</p>

        <div className="admin-grid">
          <div className="admin-panel">
            <h3>Add category</h3>
            <form className="form-grid" onSubmit={addCategory}>
              <input
                aria-label="Category name"
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
              />
              <input
                aria-label="Category image"
                placeholder="Image path"
                value={categoryForm.image}
                onChange={(event) => setCategoryForm({ ...categoryForm, image: event.target.value })}
              />
              <label className="button secondary" style={{ cursor: "pointer" }}>
                <ImagePlus size={18} aria-hidden="true" />
                Upload category image
                <input accept="image/*" onChange={(event) => uploadImage(event, "category")} style={{ display: "none" }} type="file" />
              </label>
              <input
                aria-label="Category order"
                min="1"
                type="number"
                value={categoryForm.order}
                onChange={(event) => setCategoryForm({ ...categoryForm, order: Number(event.target.value) })}
              />
              <button className="button gold" type="submit">
                <Plus size={18} aria-hidden="true" />
                Add category
              </button>
            </form>

            <h3 style={{ marginTop: 28 }}>Add menu item</h3>
            <form className="form-grid" onSubmit={addItem}>
              <input
                aria-label="Item name"
                placeholder="Item name"
                value={itemForm.name}
                onChange={(event) => setItemForm({ ...itemForm, name: event.target.value })}
              />
              <select
                aria-label="Category"
                value={itemForm.categoryId || ""}
                onChange={(event) => setItemForm({ ...itemForm, categoryId: event.target.value })}
              >
                {sortedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <textarea
                aria-label="Description"
                placeholder="Short description"
                value={itemForm.description}
                onChange={(event) => setItemForm({ ...itemForm, description: event.target.value })}
              />
              <input
                aria-label="Price"
                placeholder="Price, for example 3.50"
                value={itemForm.price}
                onChange={(event) => setItemForm({ ...itemForm, price: event.target.value })}
              />
              <input
                aria-label="Tag"
                placeholder="Tag, for example Popular"
                value={itemForm.tag || ""}
                onChange={(event) => setItemForm({ ...itemForm, tag: event.target.value })}
              />
              <input
                aria-label="Image path"
                placeholder="Image path"
                value={itemForm.image}
                onChange={(event) => setItemForm({ ...itemForm, image: event.target.value })}
              />
              <label className="button secondary" style={{ cursor: "pointer" }}>
                <ImagePlus size={18} aria-hidden="true" />
                Upload image
                <input accept="image/*" onChange={(event) => uploadImage(event, "item")} style={{ display: "none" }} type="file" />
              </label>
              <label>
                <input
                  checked={itemForm.featured || false}
                  onChange={(event) => setItemForm({ ...itemForm, featured: event.target.checked })}
                  type="checkbox"
                />{" "}
                Featured on homepage
              </label>
              <button className="button gold" type="submit">
                <Plus size={18} aria-hidden="true" />
                Add menu item
              </button>
            </form>
          </div>

          <div className="admin-panel">
            <h3>Current menu items</h3>
            <div className="admin-list">
              {sortedItems.map((item) => (
                <article className="admin-list-item" key={item.id}>
                  <Image src={item.image} alt={item.name} width={144} height={116} />
                  <div>
                    <strong>{item.name}</strong>
                    <p style={{ margin: "4px 0", color: "var(--muted)", fontFamily: "Trebuchet MS, sans-serif" }}>{item.price} - {item.available ? "Visible" : "Masqué"}</p>
                    <p style={{ margin: 0, color: "var(--muted)", fontFamily: "Trebuchet MS, sans-serif" }}>
                      {sortedCategories.find((category) => category.id === item.categoryId)?.name}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="button secondary" title="Toggle availability" type="button" onClick={() => toggleItem(item.id, "available")}>
                      <Eye size={18} aria-hidden="true" />
                    </button>
                    <button className="button secondary" title="Delete item" type="button" onClick={() => deleteItem(item.id)}>
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
