import type { Metadata } from "next";
import { Product, connectDb } from "@/lib/db/models";
import { getCategoryBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = "Product";
  const description =
    "Explore premium Rilito menswear — panjabi, t-shirts, shirts, pants, winter fashion and footwear with cash on delivery across Bangladesh.";

  try {
    await connectDb();
    const product = await Product.findOne({ slug })
      .select(
        "name slug category sku description images price salePrice stock"
      )
      .lean()
      .exec();
    if (product) {
      const category = getCategoryBySlug(product.category);
      const fullTitle = `${product.name} | ${category?.name ?? "Rilito"} | Rilito`;
      const desc = `${product.name} — ${product.description.slice(0, 150)}${
        product.description.length > 150 ? "…" : ""
      } Available in ${product.sizes.join(", ")}. Cash on delivery across Bangladesh.`;
      return {
        title: fullTitle,
        description: desc,
        openGraph: {
          title: fullTitle,
          description: desc,
          images: product.images?.[0] ? [product.images[0]] : undefined,
        },
      };
    }
  } catch {
    // fall back to generic metadata below if DB is unavailable
  }

  return { title, description };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
