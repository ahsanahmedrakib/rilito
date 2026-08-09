export type ValueIconKey = "truck" | "cash" | "refresh" | "shield";

export interface HomeValue {
  icon: ValueIconKey;
  title: string;
  text: string;
}

export const values: HomeValue[] = [
  {
    icon: "truck",
    title: "Fast Nationwide Delivery",
    text: "1-3 days inside Dhaka. Free on orders over ৳2,000.",
  },
  {
    icon: "cash",
    title: "Cash on Delivery",
    text: "Inspect your parcel, then pay. Simple and safe.",
  },
  {
    icon: "refresh",
    title: "7-Day Easy Exchange",
    text: "Wrong size? We swap it for free within a week.",
  },
  {
    icon: "shield",
    title: "100% Authentic",
    text: "Every stitch quality-checked before it ships.",
  },
];

export interface HomeTestimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
}

export const testimonials: HomeTestimonial[] = [
  {
    name: "Tanvir Ahmed",
    role: "Verified buyer · T-Shirts",
    text: "The oversized tee is better than imported brands at twice the price. Wash after wash, the collar stays perfect.",
    initials: "TA",
  },
  {
    name: "Sabbir Rahman",
    role: "Verified buyer · Panjabi",
    text: "Bought the Katkono panjabi for Eid. The cut, the fabric, the fit — I got more compliments than I could count.",
    initials: "SR",
  },
  {
    name: "Nafis Islam",
    role: "Verified buyer · Winter",
    text: "Quilted bomber arrived in 2 days, COD. Warm, sharp, and the size guide was spot on. Already ordered the puffer.",
    initials: "NI",
  },
];