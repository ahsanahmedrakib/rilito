export const WEBSITE_NAME = "Rilito";
export const HOTLINE = "01979-394059";
export const HOTLINE_LINK = "tel:01979394059";
export const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61581708810798";
export const SUPPORT_EMAIL = "support@rilito.com";
export const STORE_ADDRESS = "Level 3, Shop 12, Bashundhara City, Panthapath, Dhaka 1205";
export const WHATSAPP_URL = "https://wa.me/8801979394059";

export const socialLinks = {
  facebook: FACEBOOK_URL,
  whatsapp: WHATSAPP_URL,
  instagram: "https://www.instagram.com/rilito.bd",
  tiktok: "https://www.tiktok.com/@rilito.bd",
  youtube: "https://www.youtube.com/@rilito.bd",
};

export function img(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
}