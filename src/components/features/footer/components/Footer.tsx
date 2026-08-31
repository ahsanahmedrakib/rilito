"use client";

import {
  CashIcon,
  FacebookIcon,
  InstagramIcon,
  LogoMark,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TikTokIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from "@/components/shared/components/icons";
import { HOTLINE, SUPPORT_EMAIL, socialLinks } from "@/components/shared/data/site";
import {
  companyLinks,
  paymentMethods,
  serviceLinks,
} from "@/features/footer/data/links";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { usePathname } from "next/navigation";

const help = serviceLinks;
const company = companyLinks;

export function Footer() {
  const pathname = usePathname();
  const { categories } = useStore();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="mt-20 bg-ink-950 text-ink-300">
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-9 w-9 text-brand-500" />
              <span className="text-2xl font-black uppercase tracking-tighter text-white">
                Rilito
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Modern menswear designed in Bangladesh — everyday essentials,
              elegant panjabi and occasion wear with a clean fit and honest
              fabric.
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <a
                href={`tel:${HOTLINE.replace("-", "")}`}
                className="flex items-center gap-2.5 hover:text-white"
              >
                <PhoneIcon className="h-4 w-4 text-brand-500" /> {HOTLINE}
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2.5 hover:text-white"
              >
                <MailIcon className="h-4 w-4 text-brand-500" />{" "}
                {SUPPORT_EMAIL}
              </a>
              <p className="flex items-start gap-2.5">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Biswas Market, Bangabandhu Sarak Bylane, Gopalganj-8100
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Categories
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm">
              {categories.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="transition hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {help.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-white">
              Follow us
            </h3>
            <div className="mt-3 flex gap-2.5">
              {[
                {
                  href: socialLinks.facebook,
                  icon: <FacebookIcon className="h-5 w-5" />,
                },
                {
                  href: socialLinks.instagram,
                  icon: <InstagramIcon className="h-5 w-5" />,
                },
                {
                  href: socialLinks.whatsapp,
                  icon: <WhatsAppIcon className="h-5 w-5" />,
                },
                {
                  href: socialLinks.tiktok,
                  icon: <TikTokIcon className="h-5 w-5" />,
                },
                {
                  href: socialLinks.youtube,
                  icon: <YoutubeIcon className="h-5 w-5" />,
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm">
              <CashIcon className="h-4 w-4 text-brand-500" />
              {paymentMethods.map((m, i) => (
                <span key={m} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/20">|</span>}
                  <span>{m}</span>
                </span>
              ))}
            </div>
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} Rilito. All Rights Reserved.
            </p>
            <Link
              href="/admin"
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/60 transition hover:border-brand-500 hover:text-brand-400"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

