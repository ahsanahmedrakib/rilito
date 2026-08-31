export const WEBSITE_NAME = "Rilito";
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://rilito.com";
export const HOTLINE = "01611-773755";
export const HOTLINE_LINK = "tel:01611773755";
export const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61581708810798";
export const SUPPORT_EMAIL = "rilito.com@gmail.com";
export const STORE_ADDRESS =
  "Biswas Market, Bangabandhu Sarak Bylane, Gopalganj-8100";
export const WHATSAPP_URL = "https://wa.me/8801611773755";

export const socialLinks = {
  facebook: FACEBOOK_URL,
  whatsapp: WHATSAPP_URL,
  instagram: "https://www.instagram.com/rilito.bd",
  tiktok: "https://www.tiktok.com/@rilito.com",
  youtube: "https://www.youtube.com/@rilito.bd",
};

export function img(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
}