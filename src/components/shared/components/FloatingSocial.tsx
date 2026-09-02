"use client";

import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/shared/components/icons";
import { usePathname } from "next/navigation";

const socials = [
  {
    name: "Messenger",
    href: "https://m.me/profile.php?id=61581708810798",
    color: "#0084ff",
    Icon: FacebookIcon,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/8801611773755",
    color: "#25D366",
    Icon: WhatsAppIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61581708810798",
    color: "#1877F2",
    Icon: FacebookIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/rilito.bd",
    color:
      "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    Icon: InstagramIcon,
  },
];

export function FloatingSocial() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="social-float-bar fixed right-0 top-1/2 z-40 -translate-y-1/2 flex flex-col items-center gap-2 rounded-l-2xl bg-white/80 p-1.5 shadow-lg ring-1 ring-ink-200/60 backdrop-blur">
      {socials.map(({ name, href, color, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          title={name}
          className="social-float-icon grid h-9 w-9 place-items-center rounded-full text-white shadow-md transition-transform duration-300 hover:scale-110"
          style={{ background: color }}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
