"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Home,
  ImageIcon,
  ImagePlus,
  LayoutGrid,
  LogOut,
  Menu,
  Plus,
  Save,
  ShoppingBag,
  Star,
  Trash2,
  UtensilsCrossed,
  X
} from "lucide-react";
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

const DEFAULT_ITEM_IMAGE =
  "https://xtlchcjaksrnijakmnfv.supabase.co/storage/v1/object/public/media/assets/menu/patisseries/image_58.jpg";
const DEFAULT_CATEGORY_IMAGE =
  "https://xtlchcjaksrnijakmnfv.supabase.co/storage/v1/object/public/media/assets/gallery/shop/image_00.jpg";

const emptyItem: Omit<MenuItem, "id"> = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  image: DEFAULT_ITEM_IMAGE,
  featured: false,
  available: true,
  tag: "",
  order: 99
};

const emptyCategory: Omit<Category, "id"> = {
  name: "",
  image: DEFAULT_CATEGORY_IMAGE,
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

function nextOrder(values: { order?: number }[]): number {
  return values.length ? Math.max(...values.map((v) => v.order || 0)) + 1 : 1;
}

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<ContentData>({ categories: [], items: [], gallery: [] });
  const [itemForm, setItemForm] = useState<Omit<MenuItem, "id">>(emptyItem);
  const [categoryForm, setCategoryForm] = useState<Omit<Category, "id">>(emptyCategory);
  const [status, setStatus] = useState<string>("Loading content...");
  const [menuOpen, setMenuOpen] = useState(false);

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

  async function logout(): Promise<void> {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

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
      order: nextOrder(content.categories),
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
      order: nextOrder(content.items),
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

  function editItemField(id: string, key: keyof MenuItem, value: string): void {
    setContent({
      ...content,
      items: content.items.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    });
  }

  function toggleCategoryVisible(id: string, visible: boolean): void {
    const nextContent = {
      ...content,
      categories: content.categories.map((category) => (category.id === id ? { ...category, visible } : category))
    };
    setContent(nextContent);
    save(nextContent);
  }

  function editCategoryField(id: string, key: keyof Category, value: string): void {
    setContent({
      ...content,
      categories: content.categories.map((category) => (category.id === id ? { ...category, [key]: value } : category))
    });
  }

  function deleteCategory(id: string): void {
    if (!window.confirm("Delete this category and all of its menu items?")) return;
    const nextContent = {
      ...content,
      categories: content.categories.filter((category) => category.id !== id),
      items: content.items.filter((item) => item.categoryId !== id)
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
        <div className="admin-sidebar-top">
          <Image
            className="admin-sidebar-logo"
            src="https://xtlchcjaksrnijakmnfv.supabase.co/storage/v1/object/public/media/assets/logo/logo.png"
            alt="L'Eclair de Calais logo"
            width={44}
            height={44}
          />
          <button
            className="nav-toggle admin-sidebar-toggle"
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>

        <div className={`admin-sidebar-body ${menuOpen ? "open" : ""}`}>
          <h3>Back Office</h3>
          <p>Simple editing space for menu categories, products, images, and availability.</p>
          <nav className="admin-sidebar-links">
            <Link href="/">
              <Home size={18} aria-hidden="true" />
              View website
            </Link>
            <Link href="/menu">
              <UtensilsCrossed size={18} aria-hidden="true" />
              View menu page
            </Link>
            <Link href="/gallery">
              <ImageIcon size={18} aria-hidden="true" />
              View gallery
            </Link>
          </nav>
          <button className="button secondary admin-logout" type="button" onClick={logout}>
            <LogOut size={18} aria-hidden="true" />
            Deconnexion
          </button>
        </div>
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
        <p className={`admin-status ${status === "Saved" ? "is-saved" : status === "Could not save" ? "is-error" : ""}`}>
          {status}
        </p>

        <div className="admin-grid">
          <div className="admin-panel">
            <h3 className="admin-panel-title">
              <LayoutGrid size={20} aria-hidden="true" />
              Categories
            </h3>
            <div className="admin-list" style={{ marginBottom: 28 }}>
              {sortedCategories.map((category) => (
                <article className="admin-list-item" key={category.id}>
                  <Image src={category.image} alt={category.name} width={144} height={116} />
                  <div>
                    <input
                      aria-label="Category name"
                      value={category.name}
                      onChange={(event) => editCategoryField(category.id, "name", event.target.value)}
                      onBlur={() => save()}
                      className="admin-inline-input"
                    />
                    <label className="switch">
                      <input
                        checked={category.visible}
                        onChange={(event) => toggleCategoryVisible(category.id, event.target.checked)}
                        type="checkbox"
                      />
                      <span className="switch-track" />
                      Visible
                    </label>
                  </div>
                  <button className="button secondary" title="Delete category" type="button" onClick={() => deleteCategory(category.id)}>
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>

            <h3 className="admin-panel-title">
              <Plus size={20} aria-hidden="true" />
              Add category
            </h3>
            <form className="form-grid" onSubmit={addCategory}>
              <input
                aria-label="Category name"
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
              />
              <div className="image-picker">
                <Image src={categoryForm.image} alt="" width={56} height={56} />
                <label className="button secondary" style={{ cursor: "pointer" }}>
                  <ImagePlus size={18} aria-hidden="true" />
                  Upload category image
                  <input accept="image/*" onChange={(event) => uploadImage(event, "category")} style={{ display: "none" }} type="file" />
                </label>
              </div>
              <button className="button gold" type="submit">
                <Plus size={18} aria-hidden="true" />
                Add category
              </button>
            </form>

            <h3 className="admin-panel-title" style={{ marginTop: 28 }}>
              <Plus size={20} aria-hidden="true" />
              Add menu item
            </h3>
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
              <div className="image-picker">
                <Image src={itemForm.image} alt="" width={56} height={56} />
                <label className="button secondary" style={{ cursor: "pointer" }}>
                  <ImagePlus size={18} aria-hidden="true" />
                  Upload image
                  <input accept="image/*" onChange={(event) => uploadImage(event, "item")} style={{ display: "none" }} type="file" />
                </label>
              </div>
              <label className="switch">
                <input
                  checked={itemForm.featured || false}
                  onChange={(event) => setItemForm({ ...itemForm, featured: event.target.checked })}
                  type="checkbox"
                />
                <span className="switch-track" />
                Featured on homepage
              </label>
              <button className="button gold" type="submit">
                <Plus size={18} aria-hidden="true" />
                Add menu item
              </button>
            </form>
          </div>

          <div className="admin-panel">
            <h3 className="admin-panel-title">
              <ShoppingBag size={20} aria-hidden="true" />
              Current menu items
            </h3>
            <div className="admin-list">
              {sortedItems.map((item) => (
                <article className="admin-list-item" key={item.id}>
                  <Image src={item.image} alt={item.name} width={144} height={116} />
                  <div>
                    <input
                      aria-label="Item name"
                      value={item.name}
                      onChange={(event) => editItemField(item.id, "name", event.target.value)}
                      onBlur={() => save()}
                      className="admin-inline-input"
                    />
                    <textarea
                      aria-label="Item description"
                      value={item.description}
                      onChange={(event) => editItemField(item.id, "description", event.target.value)}
                      onBlur={() => save()}
                      className="admin-inline-textarea"
                    />
                    <div className="admin-item-meta">
                      <input
                        aria-label="Item price"
                        value={item.price}
                        onChange={(event) => editItemField(item.id, "price", event.target.value)}
                        onBlur={() => save()}
                        className="admin-inline-price"
                      />
                      <span className="admin-item-category">
                        {sortedCategories.find((category) => category.id === item.categoryId)?.name}
                      </span>
                      {item.featured ? (
                        <span className="admin-item-flag">
                          <Star size={13} aria-hidden="true" />
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      className="button secondary"
                      title={item.available ? "Mark as unavailable" : "Mark as available"}
                      type="button"
                      onClick={() => toggleItem(item.id, "available")}
                    >
                      {item.available ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
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
