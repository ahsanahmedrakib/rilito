import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function make(pathOrChildren: React.ReactNode) {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {pathOrChildren}
      </svg>
    );
  };
}

export const CartIcon = make(
  <>
    <path d="M6 6h15l-1.5 9h-12z" />
    <path d="M6 6L5 3H2" />
    <circle cx="9" cy="20" r="1.6" />
    <circle cx="18" cy="20" r="1.6" />
  </>
);

export const HeartIcon = make(
  <path d="M12 20.5s-7.5-4.7-9.3-9C1.1 8 3 4.5 6.5 4.5c2.3 0 3.9 1.4 5.5 3.4 1.6-2 3.2-3.4 5.5-3.4C21 4.5 22.9 8 21.3 11.5c-1.8 4.3-9.3 9-9.3 9z" />
);

export const SearchIcon = make(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </>
);

export const MenuIcon = make(
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </>
);

export const CloseIcon = make(
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </>
);

export const ChevronRight = make(<path d="M9 6l6 6-6 6" />);
export const ChevronLeft = make(<path d="M15 6l-6 6 6 6" />);
export const ArrowRight = make(
  <>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </>
);
export const PlusIcon = make(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>
);
export const MinusIcon = make(<path d="M5 12h14" />);
export const TrashIcon = make(
  <>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    <path d="M10 11v6M14 11v6" />
  </>
);
export const StarIcon = make(
  <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
);
export const StarFilledIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
  </svg>
);
export const TruckIcon = make(
  <>
    <path d="M1 7h14v10H1z" />
    <path d="M15 10h4l3 3v4h-7" />
    <circle cx="6" cy="19" r="1.8" />
    <circle cx="17.5" cy="19" r="1.8" />
  </>
);
export const ShieldIcon = make(
  <>
    <path d="M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </>
);
export const RefreshIcon = make(
  <>
    <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
    <path d="M21 4v4h-4" />
    <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
    <path d="M3 20v-4h4" />
  </>
);
export const CashIcon = make(
  <>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 10h.01M18 14h.01" />
  </>
);
export const PhoneIcon = make(
  <path d="M5 4h4l2 5-2.5 1.5a13 13 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
);
export const MailIcon = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </>
);
export const PinIcon = make(
  <>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </>
);
export const UserIcon = make(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
  </>
);
export const LockIcon = make(
  <>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </>
);
export const CheckIcon = make(<path d="M4 12.5l5 5L20 6.5" />);
export const FilterIcon = make(
  <>
    <path d="M3 5h18" />
    <path d="M6 12h12" />
    <path d="M10 19h4" />
  </>
);
export const GridIcon = make(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </>
);
export const ShareIcon = make(
  <>
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="18" cy="6" r="2.6" />
    <circle cx="18" cy="18" r="2.6" />
    <path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" />
  </>
);
export const PackageIcon = make(
  <>
    <path d="M21 8l-9-5-9 5v8l9 5 9-5z" />
    <path d="M3 8l9 5 9-5" />
    <path d="M12 13v8" />
  </>
);
export const CheckCircleIcon = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </>
);
export const TagIcon = make(
  <>
    <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </>
);

export const FacebookIcon = make(
  <path d="M14 8h3V4.5h-3c-2.5 0-4 1.8-4 4.2V11H7v3.5h3V21h3.5v-6.5h2.7l.5-3.5h-3.2V9c0-.6.3-1 .7-1z" />
);
export const InstagramIcon = make(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </>
);
export const WhatsAppIcon = make(
  <path d="M12 3a9 9 0 0 1 7.6 13.6l1.3 4-4.1-1.3A9 9 0 1 1 12 3zm0 2a7 7 0 1 0 3.4 13.1l.9-.5 1.7.5-.5-1.6.4-.9A7 7 0 0 0 12 5zm-3.2 4.3c.2 2 3.3 5.6 5.4 6 .1.7-.3 1.2-1 1.6-1 .4-2.9-.7-3.9-1.9-1.2-1.4-2-3.2-1-4.3.4-.5 1-.7 1.5-.5v1.1c-.3.1-.6.3-.7.6-.2.3.3.8.8 1.3.6.6 1.6 1.4 2.2 1.1.4-.2.5-.8.5-1.2.3-.2.8-.1 1.3.2.4.5 1.4 1.4 1.5 1.7 0 .2-.2.5-.3.7-.4.6-1 .9-1.7.5-2.2-1-4-2.9-5.1-4.8-.4-.7-.4-1.4-.1-2 .2-.3.5-.5.8-.5z" />
);
export const TikTokIcon = make(
  <path d="M16.6 4c.4 2.1 1.8 3.5 3.9 3.9v2.8c-1.5 0-2.8-.5-3.9-1.2v5.4c0 3.6-2.5 6.1-6 6.1-3.4 0-5.9-2.5-5.9-5.8 0-3.3 2.8-5.9 6.3-5.4v3c-1.9-.5-3.5.8-3.4 2.6 0 1.6 1.2 2.7 2.8 2.7 1.5 0 2.7-1.1 2.7-2.8V4h2.5z" />
);
export const TikTikIcon = make(
  <path d="M16.6 4c.4 2.1 1.8 3.5 3.9 3.9v2.8c-1.5 0-2.8-.5-3.9-1.2v5.4c0 3.6-2.5 6.1-6 6.1-3.4 0-5.9-2.5-5.9-5.8 0-3.3 2.8-5.9 6.3-5.4v3c-1.9-.5-3.5.8-3.4 2.6 0 1.6 1.2 2.7 2.8 2.7 1.5 0 2.7-1.1 2.7-2.8V4h2.5z" />
);
export const YoutubeIcon = make(
  <path d="M21.5 8a3 3 0 0 0-2.1-2.1C17.5 5.4 12 5.4 12 5.4s-5.5 0-7.4.5A3 3 0 0 0 2.5 8a32 32 0 0 0 0 8 3 3 0 0 0 2.1 2.1c1.9.5 7.4.5 7.4.5s5.5 0 7.4-.5a3 3 0 0 0 2.1-2.1 32 32 0 0 0 0-8zM10 15V9l5 3z" />
);

export const LogoutIcon = make(
  <>
    <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
    <path d="M17 8l4 4-4 4" />
    <path d="M21 12H10" />
  </>
);

export const LogoMark = (props: IconProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
    <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" />
    <path
      d="M9 20.5c3-1 3-8 0-9"
      stroke="#fff"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M15.5 21c3-1.3 3-8.7 0-10"
      stroke="#fff"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M22 20.5c2.6-1 2.6-8 0-9"
      stroke="#fff"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);