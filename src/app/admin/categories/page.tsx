"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";
import { ImageUploader } from "@/features/admin/components/ImageUploader";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600";

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category?: Category;
  onSave: (c: Category) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [tagline, setTagline] = useState(category?.tagline ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [accent, setAccent] = useState(
    category?.accent && /^#[0-9a-fA-F]{6}$/.test(category.accent)
      ? category.accent
      : "#111318"
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = category?.slug ?? slugify(name);
    onSave({ slug, name: name.trim(), tagline: tagline.trim(), image, accent });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-ink-200/60">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
          {category ? "Edit Category" : "Add Category"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-ink-200 px-4 py-1.5 text-xs font-bold text-ink-700 transition hover:border-ink-950"
        >
          Cancel
        </button>
      </div>
      <div>
        <label className={labelCls}>Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          placeholder="e.g. Denim"
        />
      </div>
      <div>
        <label className={labelCls}>Tagline</label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className={inputCls}
          placeholder="Short description shown in menus"
        />
      </div>
      <div>
        <ImageUploader
          value={image}
          onChange={setImage}
          label="Category image"
          aspect="video"
          hint="Shown on category pages and cards"
        />
      </div>
      <div>
        <label className={labelCls}>Accent color</label>
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-24 shrink-0 rounded-xl border border-ink-200"
            style={{
              background: `linear-gradient(135deg, ${accent}, #000000)`,
            }}
          />
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-ink-200 bg-white p-1"
            aria-label="Accent color picker"
          />
          <span className="font-mono text-sm text-ink-600">{accent}</span>
        </div>
        <p className="mt-1.5 text-xs text-ink-400">
          Used as the gradient tint on this category&apos;s page.
        </p>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-ink-950 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
      >
        {category ? "Save Changes" : "Add Category"}
      </button>
    </form>
  );
}

function AdminCategoriesManager() {
  const { categories, products, saveCategory, deleteCategory, toast } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState("");

  const editing = params.get("edit")
    ? categories.find((c) => c.slug === params.get("edit"))
    : undefined;
  const adding = !!params.get("new");

  const clearParams = () => router.replace("/admin/categories");

  const filtered = categories.filter((c) =>
    `${c.name} ${c.slug}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (adding || editing) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          {editing ? "Edit Category" : "Add Category"}
        </h1>
        <div className="mt-6">
          <CategoryForm
            category={editing}
            onCancel={clearParams}
            onSave={(c) => {
              saveCategory(c);
              toast(editing ? "Category updated" : "Category added", c.name);
              clearParams();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
          Categories
        </h1>
        <Link
          href="/admin/categories?new=1"
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-700"
        >
          + Add Category
        </Link>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search categories..."
        className="mt-6 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink-950"
      />

      <ul className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-2xl bg-white py-14 text-center text-sm text-ink-500 ring-1 ring-ink-200/60">
            No categories found.
          </p>
        ) : (
          filtered.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <li
                key={c.slug}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60"
              >
                <div className="flex items-center gap-4">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-bold text-ink-950">{c.name}</p>
                    <p className="text-xs text-ink-500">
                      <span className="font-mono">{c.slug}</span> · {count} product
                      {count === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/categories?edit=${c.slug}`}
                    className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-bold text-ink-800 transition hover:border-ink-950"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (count > 0) {
                        toast(
                          "Cannot delete",
                          "Move or remove this category's products first.",
                          "info"
                        );
                        return;
                      }
                      if (confirm(`Delete category "${c.name}"?`)) {
                        deleteCategory(c.slug);
                        toast("Category deleted", c.name, "info");
                      }
                    }}
                    className="rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-600 transition hover:border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <p className="mt-4 text-xs text-ink-500">
        A category that still has products cannot be deleted. These categories power
        the category pages, header menu and the product form.
      </p>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={null}>
      <AdminCategoriesManager />
    </Suspense>
  );
}
