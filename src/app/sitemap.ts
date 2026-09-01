import { SITE_URL } from "@/components/shared/data/site";
import { Category, Product, connectDb } from "@/lib/db/models";
import { readSettingsSafely } from "@/lib/db/seed";
import {
  allProducts,
  blogPosts as staticBlogPosts,
  categories as staticCategories,
  pageContents as staticPageContents,
} from "@/lib/data";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const settings = await readSettingsSafely();
  const blogRoutesData = settings.blogPosts?.length
    ? settings.blogPosts
    : staticBlogPosts;
  const pageRoutesData = settings.pageContents &&
    Object.keys(settings.pageContents).length
    ? settings.pageContents
    : staticPageContents;

  let categoriesRoutesData: { slug: string }[] = staticCategories;
  let productsRoutesData: { slug: string }[] = allProducts;
  try {
    await connectDb();
    const dbCategories = await Category.find().lean().exec();
    if (dbCategories.length) categoriesRoutesData = dbCategories;
    const dbProducts = await Product.find({ deleted: { $ne: true } })
      .lean()
      .exec();
    if (dbProducts.length) productsRoutesData = dbProducts;
  } catch {
    // fall back to static data if DB is unreachable
  }

  const staticRoutes = [
    "",
    "/products",
    "/cart",
    "/wishlist",
    "/checkout",
    "/account",
    "/login",
    "/register",
    "/track-order",
    "/contact",
    "/blog",
    "/order",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const categoryRoutes = categoriesRoutesData.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes = productsRoutesData.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogRoutesData.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const pageRoutes = Object.keys(pageRoutesData).map((slug) => ({
    url: `${SITE_URL}/pages/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...pageRoutes,
  ];
}