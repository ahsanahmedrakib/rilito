import type { Product, Review } from "@/lib/types";

const sampleNames = [
  "Kazi Mahi",
  "Rafi Ahmed",
  "Ayon Hossain",
  "Shadman Sakib",
  "Jubayer Khan",
  "Mehedi Hasan",
  "Zihan Rahman",
  "Fahim Chowdhury",
];
const sampleTitles = [
  "Exactly as pictured",
  "Great quality for the price",
  "Beautiful fabric, spot-on fit",
  "Orders here regularly",
  "Better than expected",
  "Sizing guide was perfect",
];
const sampleBodies = [
  "The quality genuinely surprised me. Stitching is clean, the fabric feels premium, and delivery was faster than promised.",
  "I compared a few options before buying and this remains the best choice. Ordered a second one in another colour.",
  "Fits exactly as the description said. Went with the size I normally wear and the silhouette is exactly what I wanted.",
  "Packaging was neat and the COD inspection saved me the worry. Customer service on WhatsApp answered in minutes.",
  "Already washing it a few times and there's no fading or shrinking. Colour is true to the photos.",
  "Worth every taka. This is my third item from Rilito and they stay consistent.",
];

export function seededReviews(product: Product): Review[] {
  const count = Math.min(6, (product.reviewCount % 6) + 3);
  return Array.from({ length: count }).map((_, i) => {
    const seed = (product.id.charCodeAt(2) + i * 7) % sampleNames.length;
    const daysAgo = 3 + ((i * 13 + seed) % 90);
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString();
    return {
      id: `${product.id}-r${i}`,
      author: sampleNames[(seed + i) % sampleNames.length],
      rating: product.rating - (i % 2 === 0 ? 0 : 0.2),
      title: sampleTitles[(seed + i * 2) % sampleTitles.length],
      body: sampleBodies[(seed + i * 3) % sampleBodies.length],
      date,
      verified: i !== count - 1,
    };
  });
}