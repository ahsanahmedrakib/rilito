import {
  FACEBOOK_URL,
  HOTLINE,
  WHATSAPP_URL,
} from "@/components/shared/data/site";

export const contactSubjects = [
  "Order query",
  "Delivery & shipping",
  "Exchange or return",
  "Payment issue",
  "Product question",
  "Other",
];

export interface ContactChannel {
  id: "hotline" | "email" | "whatsapp" | "facebook";
  title: string;
  value: string;
  href: string;
}

export const contactChannels: ContactChannel[] = [
  {
    id: "hotline",
    title: "Hotline",
    value: HOTLINE,
    href: `tel:${HOTLINE.replace("-", "")}`,
  },
  {
    id: "email",
    title: "Email",
    value: "rilito.com@gmail.com",
    href: "mailto:rilito.com@gmail.com",
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    value: "Chat with support",
    href: WHATSAPP_URL,
  },
  {
    id: "facebook",
    title: "Facebook",
    value: "Rilito on Facebook",
    href: FACEBOOK_URL,
  },
];
