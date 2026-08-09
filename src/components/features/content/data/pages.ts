export interface PageSection {
  heading: string;
  body: string[];
}

export const pageContents: Record<string, { title: string; sections: PageSection[] }> = {
  about: {
    title: "About Rilito",
    sections: [
      {
        heading: "Who we are",
        body: [
          "Rilito is a modern menswear brand built in Bangladesh for the way men actually dress here — between the office, the mosque, the gym and the weekend. We design and curate everyday essentials, panjabi and occasion wear with a sharp, contemporary cut and honest fabric.",
          "No imported labels, no loud logos, no trends that vanish in a season. Just clean silhouettes, heavyweight cottons and fits that hold their shape. We started with a simple belief: great style should not require a translator, an occasion or a designer budget.",
        ],
      },
      {
        heading: "What we stand for",
        body: [
          "Fit first. Every Rilito piece is cut and tested on real bodies before it reaches the shelf. Fabric second — we insist on breathable, pre-shrunk materials. Price last, and it is priced to be the obvious choice, not a luxury.",
          "We also believe in being reachable. A human answers the hotline, WhatsApp and our Facebook page. If a size is wrong, we make it right. That is the whole brand, really.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We collect only what we need to process your order: your name, delivery address, phone number and payment details. If you register, we keep your saved address and order history so checkout is faster next time.",
          "We do not sell or rent your personal information to anyone, ever. Your data is used solely to fulfil orders, improve our service and — only if you opt in — share promotions.",
        ],
      },
      {
        heading: "Data security",
        body: [
          "Payment information is handled through secure channels. We never store full card details on our servers. While we work hard to protect your data, no method of digital storage is 100% secure, so we ask that you also keep your account credentials confidential.",
          "You may request a copy or deletion of your data at any time by contacting our support team.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms and Conditions",
    sections: [
      {
        heading: "Ordering and pricing",
        body: [
          "All prices listed are in Bangladeshi Taka (৳) and inclusive of applicable taxes unless stated otherwise. We reserve the right to correct pricing errors and to cancel any order affected by such errors.",
          "Placing an order constitutes your agreement to these terms. We may verify orders flagged by our fraud-prevention checks before dispatch.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "You agree to provide accurate information at checkout, not to misuse the website, and not to attempt unauthorised access to our systems. Parcels are deemed delivered once signed for or handed to a member of the recipient's household.",
        ],
      },
    ],
  },
  returns: {
    title: "Return and Refund Policy",
    sections: [
      {
        heading: "Exchange window",
        body: [
          "You may request an exchange for unworn, unwashed items in original tags and packaging within 7 days of delivery. Exchanges are subject to availability of the replacement size or colour.",
          "To start an exchange, message us on Facebook or WhatsApp with your order ID and the item you want to swap. For size exchanges we arrange the return pickup at no cost to you.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Refunds are issued when we cannot fulfil your order or complete an exchange. Refunds are processed to the original payment method (bKash / Nagad / bank) within 3-5 working days of approval.",
          "Clearance-sale and personalised items are non-returnable unless defective. If your product arrives damaged or incorrect, we replace it at our cost — just share photo evidence within 48 hours of delivery.",
        ],
      },
    ],
  },
  delivery: {
    title: "Delivery and Shipping",
    sections: [
      {
        heading: "Delivery timeframes",
        body: [
          "Inside Dhaka: 1-3 working days. Outside Dhaka: 2-5 working days. During Eid and major sale periods, add 1-2 days to these estimates.",
          "A flat delivery fee applies to orders under ৳2,000. Orders of ৳2,000 or more ship free across Bangladesh. Express next-day delivery inside Dhaka is available at checkout for an additional fee.",
        ],
      },
      {
        heading: "What to expect",
        body: [
          "You will receive an SMS with your tracking ID once your parcel ships. For cash on delivery, you may inspect the parcel in front of the delivery personnel before paying. Please keep a photo or the SMS handy in case of a missed delivery.",
        ],
      },
    ],
  },
  booking: {
    title: "Pre-Order and Booking Policy",
    sections: [
      {
        heading: "How pre-orders work",
        body: [
          "Some limited collections are available for pre-order. You pay a 50% advance to secure your size; we deliver the balance on arrival of stock.",
          "Pre-order items ship within the timeframe stated on the product page. If a pre-order is delayed, we let you know immediately and offer a full refund or a store coupon of the same value.",
        ],
      },
    ],
  },
};