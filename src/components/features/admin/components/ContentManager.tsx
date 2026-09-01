"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "@/components/shared/components/icons";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import { useStore } from "@/lib/store";
import type {
  BlogPost,
  EditorialBanner,
  Faq,
  HomeTestimonial,
  HomeValue,
  HomeValueIcon,
  NewsletterContent,
  PageContent,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600";

const valueIconKeys: { label: string; value: HomeValueIcon }[] = [
  { label: "Truck", value: "truck" },
  { label: "Cash", value: "cash" },
  { label: "Refresh", value: "refresh" },
  { label: "Shield", value: "shield" },
];

const tabs = [
  { id: "values", label: "Home Values" },
  { id: "testimonials", label: "Testimonials" },
  { id: "banner", label: "Editorial Banner" },
  { id: "newsletter", label: "Newsletter" },
  { id: "blog", label: "Blog Posts" },
  { id: "pages", label: "Pages" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const pageSlugs = ["about", "privacy", "terms", "returns", "delivery", "booking"];

export default function ContentManager() {
  const { settings, saveSettings, toast } = useStore();
  const [tab, setTab] = useState<TabId>("values");

  const save = (patch: Partial<typeof settings>) => {
    saveSettings(patch);
    toast("Content saved", "Your changes are now live on the storefront");
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-ink-950 md:text-3xl">
        Content
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Manage the text and media shown in every section of the storefront.
        Save a section to publish it live.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition",
              tab === t.id
                ? "bg-ink-950 text-white"
                : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-100"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "values" && (
          <ValuesSection
            initial={settings.homeValues ?? []}
            onSave={(homeValues) => save({ homeValues })}
          />
        )}
        {tab === "testimonials" && (
          <TestimonialsSection
            initial={settings.testimonials ?? []}
            onSave={(testimonials) => save({ testimonials })}
          />
        )}
        {tab === "banner" && (
          <BannerSection
            initial={settings.editorialBanner}
            onSave={(editorialBanner) => save({ editorialBanner })}
          />
        )}
        {tab === "newsletter" && (
          <NewsletterSection
            initial={settings.newsletter}
            onSave={(newsletter) => save({ newsletter })}
          />
        )}
        {tab === "blog" && (
          <BlogSection
            initial={settings.blogPosts ?? []}
            onSave={(blogPosts) => save({ blogPosts })}
          />
        )}
        {tab === "pages" && (
          <PagesSection
            initial={settings.pageContents ?? {}}
            onSave={(pageContents) => save({ pageContents })}
          />
        )}
        {tab === "faq" && (
          <FaqSection
            initial={settings.faqs ?? []}
            onSave={(faqs) => save({ faqs })}
          />
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  onSave,
  children,
}: {
  title: string;
  description: string;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
      <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
        {title}
      </h2>
      <p className="mt-1 text-sm text-ink-500">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
      <button
        onClick={onSave}
        className="mt-6 w-full rounded-xl bg-ink-950 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600"
      >
        Save {title}
      </button>
    </section>
  );
}

function ValuesSection({
  initial,
  onSave,
}: {
  initial: HomeValue[];
  onSave: (values: HomeValue[]) => void;
}) {
  const [items, setItems] = useState<HomeValue[]>(initial);
  const set = (i: number, patch: Partial<HomeValue>) =>
    setItems((prev) => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));

  return (
    <SectionCard
      title="Home Values"
      description="The four brand promises shown below the hero slider on the home page."
      onSave={() => onSave(items)}
    >
      {items.length === 0 && (
        <p className="rounded-xl bg-ink-50 py-8 text-center text-sm text-ink-500">
          No values yet. Add one below.
        </p>
      )}
      {items.map((v, i) => (
        <div key={i} className="rounded-2xl border border-ink-200 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
              Value {i + 1}
            </span>
            <button
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
              className="grid h-8 w-8 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
              aria-label="Remove value"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {valueIconKeys.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set(i, { icon: opt.value })}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition",
                      v.icon === opt.value
                        ? "bg-ink-950 text-white"
                        : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Title</label>
              <input
                value={v.title}
                onChange={(e) => set(i, { title: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Text</label>
              <textarea
                value={v.text}
                onChange={(e) => set(i, { text: e.target.value })}
                rows={2}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() =>
          setItems((prev) => [
            ...prev,
            { icon: "truck", title: "", text: "" },
          ])
        }
        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:border-ink-950"
      >
        <PlusIcon className="h-4 w-4" /> Add Value
      </button>
    </SectionCard>
  );
}

function TestimonialsSection({
  initial,
  onSave,
}: {
  initial: HomeTestimonial[];
  onSave: (testimonials: HomeTestimonial[]) => void;
}) {
  const [items, setItems] = useState<HomeTestimonial[]>(initial);
  const set = (i: number, patch: Partial<HomeTestimonial>) =>
    setItems((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t))
    );

  return (
    <SectionCard
      title="Testimonials"
      description='Customer reviews shown in the "What Customers Say" section on the home page.'
      onSave={() => onSave(items)}
    >
      {items.length === 0 && (
        <p className="rounded-xl bg-ink-50 py-8 text-center text-sm text-ink-500">
          No testimonials yet. Add one below.
        </p>
      )}
      {items.map((t, i) => (
        <div key={i} className="rounded-2xl border border-ink-200 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
              Testimonial {i + 1}
            </span>
            <button
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
              className="grid h-8 w-8 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
              aria-label="Remove testimonial"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Name</label>
              <input
                value={t.name}
                onChange={(e) => set(i, { name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <input
                value={t.role}
                onChange={(e) => set(i, { role: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Initials</label>
              <input
                value={t.initials}
                onChange={(e) => set(i, { initials: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-3">
              <label className={labelCls}>Quote</label>
              <textarea
                value={t.text}
                onChange={(e) => set(i, { text: e.target.value })}
                rows={3}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() =>
          setItems((prev) => [
            ...prev,
            { name: "", role: "", text: "", initials: "" },
          ])
        }
        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:border-ink-950"
      >
        <PlusIcon className="h-4 w-4" /> Add Testimonial
      </button>
    </SectionCard>
  );
}

function BannerSection({
  initial,
  onSave,
}: {
  initial: EditorialBanner;
  onSave: (banner: EditorialBanner) => void;
}) {
  const [banner, setBanner] = useState<EditorialBanner>(initial);
  const set = (patch: Partial<EditorialBanner>) =>
    setBanner((prev) => ({ ...prev, ...patch }));

  return (
    <SectionCard
      title="Editorial Banner"
      description='The "Rilito Edit" campaign banner on the home page.'
      onSave={() => onSave(banner)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ImageUploader
            value={banner.image ?? ""}
            onChange={(image) => set({ image })}
            label="Banner image"
            aspect="video"
          />
        </div>
        <div>
          <label className={labelCls}>Eyebrow</label>
          <input
            value={banner.eyebrow}
            onChange={(e) => set({ eyebrow: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Title (use \n for a line break)</label>
          <input
            value={banner.title}
            onChange={(e) => set({ title: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Subtitle</label>
          <textarea
            value={banner.subtitle}
            onChange={(e) => set({ subtitle: e.target.value })}
            rows={3}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Primary button label</label>
          <input
            value={banner.primaryCta?.label}
            onChange={(e) =>
              set({
                primaryCta: {
                  ...banner.primaryCta,
                  label: e.target.value,
                },
              })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Primary button link</label>
          <input
            value={banner.primaryCta?.href}
            onChange={(e) =>
              set({ primaryCta: { ...banner.primaryCta, href: e.target.value } })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Secondary button label</label>
          <input
            value={banner.secondaryCta?.label}
            onChange={(e) =>
              set({
                secondaryCta: {
                  ...banner.secondaryCta,
                  label: e.target.value,
                },
              })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Secondary button link</label>
          <input
            value={banner.secondaryCta?.href}
            onChange={(e) =>
              set({
                secondaryCta: { ...banner.secondaryCta, href: e.target.value },
              })
            }
            className={inputCls}
          />
        </div>
      </div>
    </SectionCard>
  );
}

function NewsletterSection({
  initial,
  onSave,
}: {
  initial: NewsletterContent;
  onSave: (newsletter: NewsletterContent) => void;
}) {
  const [newsletter, setNewsletter] = useState<NewsletterContent>(initial);
  const set = (patch: Partial<NewsletterContent>) =>
    setNewsletter((prev) => ({ ...prev, ...patch }));

  return (
    <SectionCard
      title="Newsletter"
      description="Marketing copy for the newsletter signup section on the home page."
      onSave={() => onSave(newsletter)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Title</label>
          <input
            value={newsletter.title}
            onChange={(e) => set({ title: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Subtitle</label>
          <textarea
            value={newsletter.subtitle}
            onChange={(e) => set({ subtitle: e.target.value })}
            rows={3}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Email placeholder</label>
          <input
            value={newsletter.placeholder}
            onChange={(e) => set({ placeholder: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Button label</label>
          <input
            value={newsletter.buttonLabel}
            onChange={(e) => set({ buttonLabel: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Code intro text</label>
          <input
            value={newsletter.codeIntro}
            onChange={(e) => set({ codeIntro: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Discount code</label>
          <input
            value={newsletter.codeValue}
            onChange={(e) => set({ codeValue: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Code outro text</label>
          <input
            value={newsletter.codeOutro}
            onChange={(e) => set({ codeOutro: e.target.value })}
            className={inputCls}
          />
        </div>
      </div>
    </SectionCard>
  );
}

function BlogSection({
  initial,
  onSave,
}: {
  initial: BlogPost[];
  onSave: (posts: BlogPost[]) => void;
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);

  const set = (i: number, patch: Partial<BlogPost>) =>
    setPosts((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const setPara = (i: number, paraIdx: number, value: string) =>
    setPosts((prev) =>
      prev.map((p, idx) =>
        idx === i
          ? {
              ...p,
              content: p.content.map((c, cIdx) =>
                cIdx === paraIdx ? value : c
              ),
            }
          : p
      )
    );

  const newPost = (): BlogPost => ({
    slug: "",
    title: "",
    excerpt: "",
    image: "",
    date: new Date().toISOString().slice(0, 10),
    author: "",
    category: "",
    readTime: "",
    content: [""],
  });

  return (
    <SectionCard
      title="Blog Posts"
      description='Stories shown on /blog and the "Latest From The Blog" home section.'
      onSave={() => onSave(posts)}
    >
      {posts.length === 0 && (
        <p className="rounded-xl bg-ink-50 py-8 text-center text-sm text-ink-500">
          No posts yet. Add one below.
        </p>
      )}
      <div className="space-y-3">
        {posts.map((p, i) =>
          editing === i ? (
            <div key={i} className="rounded-2xl border-2 border-brand-600 bg-white p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <ImageUploader
                    value={p.image}
                    onChange={(image) => set(i, { image })}
                    label="Cover image"
                    aspect="video"
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug (URL)</label>
                  <input
                    value={p.slug}
                    onChange={(e) => set(i, { slug: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    value={p.title}
                    onChange={(e) => set(i, { title: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Excerpt</label>
                  <textarea
                    value={p.excerpt}
                    onChange={(e) => set(i, { excerpt: e.target.value })}
                    rows={2}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input
                    type="date"
                    value={p.date}
                    onChange={(e) => set(i, { date: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Author</label>
                  <input
                    value={p.author}
                    onChange={(e) => set(i, { author: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <input
                    value={p.category}
                    onChange={(e) => set(i, { category: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Read time</label>
                  <input
                    value={p.readTime}
                    onChange={(e) => set(i, { readTime: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Content paragraphs</label>
                  <div className="space-y-2">
                    {p.content.map((para, paraIdx) => (
                      <textarea
                        key={paraIdx}
                        value={para}
                        onChange={(e) => setPara(i, paraIdx, e.target.value)}
                        rows={3}
                        className={inputCls}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      set(i, {
                        content: [...p.content, ""],
                      })
                    }
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-700 transition hover:border-ink-950"
                  >
                    <PlusIcon className="h-3.5 w-3.5" /> Add paragraph
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-bold text-ink-700 transition hover:bg-ink-100"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-ink-200 p-4"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-950">{p.title || "Untitled post"}</p>
                <p className="text-xs text-ink-500">
                  {p.slug || "no slug"} · {p.category || "no category"} · {p.date}
                </p>
              </div>
              <button
                onClick={() => setEditing(i)}
                className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-700 transition hover:bg-ink-100"
              >
                Edit
              </button>
              <button
                onClick={() => setPosts((prev) => prev.filter((_, idx) => idx !== i))}
                className="grid h-8 w-8 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
                aria-label="Delete post"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )
        )}
      </div>
      <button
        onClick={() => {
          setPosts((prev) => [...prev, newPost()]);
          setEditing(posts.length);
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:border-ink-950"
      >
        <PlusIcon className="h-4 w-4" /> Add Post
      </button>
    </SectionCard>
  );
}

const pageLabels: Record<string, string> = {
  about: "About",
  privacy: "Privacy Policy",
  terms: "Terms and Conditions",
  returns: "Return Policy",
  delivery: "Delivery",
  booking: "Pre-Order & Booking",
};

function PagesSection({
  initial,
  onSave,
}: {
  initial: Record<string, PageContent>;
  onSave: (pages: Record<string, PageContent>) => void;
}) {
  const [pages, setPages] = useState<Record<string, PageContent>>(initial);
  const [selected, setSelected] = useState(pageSlugs[0]);
  const page = pages[selected] ?? { title: "", sections: [] };

  const setTitle = (title: string) =>
    setPages((prev) => ({
      ...prev,
      [selected]: { ...(prev[selected] ?? { title: "", sections: [] }), title },
    }));

  const setSection = (i: number, patch: Partial<PageContent["sections"][number]>) =>
    setPages((prev) => {
      const current = prev[selected] ?? { title: "", sections: [] };
      return {
        ...prev,
        [selected]: {
          ...current,
          sections: current.sections.map((s, idx) =>
            idx === i ? { ...s, ...patch } : s
          ),
        },
      };
    });

  const addSection = () =>
    setPages((prev) => {
      const current = prev[selected] ?? { title: "", sections: [] };
      return {
        ...prev,
        [selected]: {
          ...current,
          sections: [...current.sections, { heading: "", body: [""] }],
        },
      };
    });

  const setPara = (sIdx: number, pIdx: number, value: string) =>
    setPages((prev) => {
      const current = prev[selected] ?? { title: "", sections: [] };
      return {
        ...prev,
        [selected]: {
          ...current,
          sections: current.sections.map((s, idx) =>
            idx === sIdx
              ? {
                  ...s,
                  body: s.body.map((b, bIdx) => (bIdx === pIdx ? value : b)),
                }
              : s
          ),
        },
      };
    });

  const addPara = (sIdx: number) =>
    setPages((prev) => {
      const current = prev[selected] ?? { title: "", sections: [] };
      return {
        ...prev,
        [selected]: {
          ...current,
          sections: current.sections.map((s, idx) =>
            idx === sIdx ? { ...s, body: [...s.body, ""] } : s
          ),
        },
      };
    });

  return (
    <SectionCard
      title="Pages"
      description="Static info pages served at /pages/about, /pages/privacy, and so on."
      onSave={() => onSave(pages)}
    >
      <div className="flex flex-wrap gap-2">
        {pageSlugs.map((slug) => (
          <button
            key={slug}
            onClick={() => setSelected(slug)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition",
              selected === slug
                ? "bg-ink-950 text-white"
                : "bg-ink-100 text-ink-600 hover:bg-ink-200"
            )}
          >
            {pageLabels[slug]}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-ink-200 p-4">
        <label className={labelCls}>Page title</label>
        <input
          value={page.title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
        />

        <div className="mt-4 space-y-4">
          {page.sections.map((s, sIdx) => (
            <div key={sIdx} className="rounded-xl bg-ink-50 p-4">
              <label className={labelCls}>Section heading</label>
              <input
                value={s.heading}
                onChange={(e) => setSection(sIdx, { heading: e.target.value })}
                className={inputCls}
              />
              <div className="mt-3 space-y-2">
                {s.body.map((para, pIdx) => (
                  <textarea
                    key={pIdx}
                    value={para}
                    onChange={(e) => setPara(sIdx, pIdx, e.target.value)}
                    rows={3}
                    className={inputCls}
                  />
                ))}
              </div>
              <button
                onClick={() => addPara(sIdx)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-700 transition hover:border-ink-950"
              >
                <PlusIcon className="h-3.5 w-3.5" /> Add paragraph
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addSection}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2 text-sm font-bold text-ink-700 transition hover:border-ink-950"
        >
          <PlusIcon className="h-4 w-4" /> Add Section
        </button>
      </div>
    </SectionCard>
  );
}

function FaqSection({
  initial,
  onSave,
}: {
  initial: Faq[];
  onSave: (faqs: Faq[]) => void;
}) {
  const [items, setItems] = useState<Faq[]>(initial);
  const set = (i: number, patch: Partial<Faq>) =>
    setItems((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  return (
    <SectionCard
      title="FAQ"
      description="Questions and answers shown on the /pages/faq page."
      onSave={() => onSave(items)}
    >
      {items.length === 0 && (
        <p className="rounded-xl bg-ink-50 py-8 text-center text-sm text-ink-500">
          No FAQs yet. Add one below.
        </p>
      )}
      {items.map((f, i) => (
        <div key={i} className="rounded-2xl border border-ink-200 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
              FAQ {i + 1}
            </span>
            <button
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
              className="grid h-8 w-8 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
              aria-label="Remove FAQ"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid gap-3">
            <div>
              <label className={labelCls}>Question</label>
              <input
                value={f.question}
                onChange={(e) => set(i, { question: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Answer</label>
              <textarea
                value={f.answer}
                onChange={(e) => set(i, { answer: e.target.value })}
                rows={3}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => setItems((prev) => [...prev, { question: "", answer: "" }])}
        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:border-ink-950"
      >
        <PlusIcon className="h-4 w-4" /> Add FAQ
      </button>
    </SectionCard>
  );
}