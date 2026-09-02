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

function makeFilled(pathOrChildren: React.ReactNode) {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
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

export const UploadIcon = make(
  <g>
    <path d="M12 16V4" />
    <path d="M7 9l5-5 5 5" />
    <path d="M4 20h16" />
  </g>
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
export const InfoIcon = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01" />
    <path d="M12 11v5" />
  </>
);

export const FacebookIcon = makeFilled(
  <path d="M14 8h3V4.5h-3c-2.5 0-4 1.8-4 4.2V11H7v3.5h3V21h3.5v-6.5h2.7l.5-3.5h-3.2V9c0-.6.3-1 .7-1z" />
);
export const MessengerIcon = makeFilled(
  <path d="M12 2C6.36 2 2 6.14 2 11.47c0 2.93 1.38 5.53 3.54 7.29V22l3.28-1.79c.98.27 2 .42 3.18.42 5.64 0 10-4.14 10-9.16C22 6.14 17.64 2 12 2zm5.1 6.72l-2.71 2.92a.72.72 0 0 1-.92.09l-1.9-1.28a.48.48 0 0 0-.56.03l-3.4 3.2c-.26.24-.66-.11-.44-.39l2.71-2.89a.72.72 0 0 1 .92-.09l1.9 1.27a.48.48 0 0 0 .56-.03l3.4-3.2c.26-.24.66.11.44.39z" />
);
export const InstagramIcon = makeFilled(
  <>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth={1.8} />
    <circle cx="17.5" cy="6.5" r="1.5" />
  </>
);
export const WhatsAppIcon = makeFilled(
  <path d="M12.04 2C6.47 2 2 6.48 2 12.06c0 1.77.46 3.5 1.34 5.02L2 22l5.08-1.31a9.98 9.98 0 0 0 4.96 1.27h.01c5.58 0 10.05-4.48 10.05-10.06A9.99 9.99 0 0 0 12.04 2zm5.84 14.18c-.24.68-1.4 1.31-1.93 1.35-.53.05-1.02.24-3.46-.72-2.94-1.15-4.82-4.14-4.97-4.33-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.01-2.42.26-.29.57-.36.76-.36h.55c.18 0 .42-.06.65.5.24.57.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.3.38-.42.51-.14.14-.29.29-.12.57.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.38-.24.64-.14.26.09 1.66.78 1.94.92.29.14.48.21.55.33.07.12.07.67-.16 1.34z" />
);
export const TikTokIcon = makeFilled(
  <path d="M16.6 4c.4 2.1 1.8 3.5 3.9 3.9v2.8c-1.5 0-2.8-.5-3.9-1.2v5.4c0 3.6-2.5 6.1-6 6.1-3.4 0-5.9-2.5-5.9-5.8 0-3.3 2.8-5.9 6.3-5.4v3c-1.9-.5-3.5.8-3.4 2.6 0 1.6 1.2 2.7 2.8 2.7 1.5 0 2.7-1.1 2.7-2.8V4h2.5z" />
);
export const YoutubeIcon = makeFilled(
  <path d="M21.5 8a3 3 0 0 0-2.1-2.1C17.5 5.4 12 5.4 12 5.4s-5.5 0-7.4.5A3 3 0 0 0 2.5 8a32 32 0 0 0 0 8 3 3 0 0 0 2.1 2.1c1.9.5 7.4.5 7.4.5s5.5 0 7.4-.5a3 3 0 0 0 2.1-2.1 32 32 0 0 0 0-8zM10 15V9l5 3z" />
);

export const LogoutIcon = make(
  <>
    <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
    <path d="M17 8l4 4-4 4" />
    <path d="M21 12H10" />
  </>
);

export const EyeIcon = make(
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const EyeOffIcon = make(
  <>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.2 3.2" />
    <path d="M6.6 6.6A16.5 16.5 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 3.8-.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </>
);

export const LogoMark = ({
  className,
  src = "/logo.png",
}: {
  className?: string;
  src?: string;
}) => (
  <img
    src={src}
    alt="Rilito"
    aria-hidden="true"
    loading="lazy"
    className={className}
  />
);