"use client";

import { SITE_URL, WEBSITE_NAME } from "@/components/shared/data/site";
import { useEffect } from "react";

type Props = {
  name: string;
  slug: string;
  sku?: string;
  image: string;
  description?: string;
  price: number;
  salePrice?: number;
  category?: string;
  rating?: number;
  reviewCount?: number;
};

export function ProductJsonLd(p: Props) {
  useEffect(() => {
    const t = `${p.name} — ${WEBSITE_NAME}`;
    if (document.title !== t) document.title = t;
    const meta = document.querySelector('meta[name="description"]');
    if (p.description && meta) meta.setAttribute("content", p.description);
  }, [p.name, p.description]);

  const offers: Record<string, unknown> = {
    "@type": "Offer",
    url: `${SITE_URL}/product/${p.slug}`,
    priceCurrency: "BDT",
    price: String(p.salePrice ?? p.price),
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  };

  const structured = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    ...(p.sku ? { sku: p.sku } : {}),
    ...(p.category ? { category: p.category } : {}),
    image: p.image,
    offers,
    ...(p.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(p.rating),
            reviewCount: String(p.reviewCount ?? 0),
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
    />
  );
}
