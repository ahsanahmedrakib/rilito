"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AppSettings,
  CartItem,
  Category,
  ContactQuery,
  Coupon,
  HeroSlide,
  Order,
  Product,
  Review,
  User,
} from "./types";
import { defaultCoupons } from "./coupons";
import { allProducts, categories as defaultCategories } from "./data";

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  password?: string;
}

interface ApiUser {
  _id?: unknown;
  id?: unknown;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  role?: string;
}

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: "success" | "info" | "error";
}

interface StoreContextValue {
  ready: boolean;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, qty: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  user: User | null;
  register: (user: User & { password: string }) => Promise<{ ok: boolean; error: string | null }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error: string | null }>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ ok: boolean; error: string | null }>;
  logoutAdmin: () => void;
  adminUser: AdminAccount | null;
  adminUsers: AdminAccount[];
  addAdminUser: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  updateAdminUser: (
    id: string,
    patch: { name?: string; role?: string; password?: string }
  ) => Promise<{ ok: boolean; error?: string }>;
  deleteAdminUser: (id: string) => Promise<{ ok: boolean; error?: string }>;
  isSuperadmin: boolean;
  products: Product[];
  deletedProducts: Product[];
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  restoreProduct: (id: string) => void;
  permanentlyDeleteProduct: (id: string) => void;
  isSkuTaken: (sku: string, excludeId?: string) => boolean;
  categories: Category[];
  saveCategory: (category: Category) => void;
  deleteCategory: (slug: string) => boolean;
  reviews: Review[];
  submitReview: (review: Review) => void;
  setReviewStatus: (id: string, status: Review["status"]) => void;
  settings: AppSettings;
  saveSettings: (patch: Partial<AppSettings>) => void;
  saveHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlide: (id: string, dir: -1 | 1) => void;
  coupons: Coupon[];
  saveCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  orders: Order[];
  placeOrder: (
    order: Omit<Order, "id" | "date" | "status" | "total">
  ) => Promise<Order>;
  updateOrderStatus: (id: string, status: string) => void;
  updateOrderTracking: (
    id: string,
    tracking: { courier: string; trackingId: string; note: string }
  ) => void;
  contactQueries: ContactQuery[];
  markContactQuery: (id: string, read: boolean) => void;
  deleteContactQuery: (id: string) => void;
  toast: (title: string, description?: string, variant?: Toast["variant"]) => void;
  toasts: Toast[];
}

const StoreContext = createContext<StoreContextValue | null>(null);

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function api<T>(
  path: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`/api${path}`, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const text = await res.text();
    let json: unknown = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    if (!res.ok) {
      const message =
        (json as { error?: string } | null)?.error ||
        `Request failed with status ${res.status}`;
      return { data: null, error: message };
    }
    return { data: (json as T) ?? null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { data: null, error: message };
  }
}

function persistHeroSlides(heroSlides: HeroSlide[]) {
  api("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify({ heroSlides }),
  });
}

const defaultHeroSlides: HeroSlide[] = [
  {
    id: "slide-tshirts",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "New Season · Street & Classic",
    title: "Wear The Moment",
    subtitle:
      "Heavyweight tees, sharp shirts and relaxed fits — cut for the way you actually dress.",
    cta: { href: "/category/t-shirts", label: "Shop T-Shirts" },
    order: 1,
    active: true,
  },
  {
    id: "slide-panjabi",
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Panjabi · Eid & Beyond",
    title: "Elegance In Every Thread",
    subtitle:
      "From classic cotton to intricate embroidery, find the panjabi that carries the occasion.",
    cta: { href: "/category/panjabi", label: "Explore Panjabi" },
    order: 2,
    active: true,
  },
  {
    id: "slide-winter",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Winter Drop · Up to 40% Off",
    title: "Bundle Up In Style",
    subtitle:
      "Quilted bombers, puffer jackets and cosy knits that handle the cold without hiding your look.",
    cta: { href: "/category/winter", label: "Shop Winter" },
    order: 3,
    active: true,
  },
];

const defaultSettings: AppSettings = {
  qrImage: "",
  paymentNumber: "01611-773755",
  paymentNote: "Send to this number and keep the transaction ID.",
  marqueeTexts: [
    "FREE DELIVERY ON ORDERS OVER ৳2,000",
    "FLAT 40% OFF SELECTED STYLES — SALE NOW LIVE",
    "CASH ON DELIVERY ACROSS BANGLADESH",
    "7-DAY EASY EXCHANGE ON ALL ORDERS",
  ],
  heroSlides: defaultHeroSlides,
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(defaultCoupons);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminAccount | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminAccount[]>([]);
  const [contactQueries, setContactQueries] = useState<ContactQuery[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const hydrate = async () => {
      setCart(readLS("rilito-cart", []));
      setWishlist(readLS("rilito-wishlist", []));

      const [pd, ct, cp, rv, st] = await Promise.all([
        api<{ products: Product[] }>("/products"),
        api<{ categories: Category[] }>("/categories"),
        api<{ coupons: Coupon[] }>("/coupons"),
        api<{ reviews: Review[] }>("/reviews"),
        api<{ settings: AppSettings }>("/settings"),
      ]);

      setProducts(pd?.data?.products?.length ? pd.data.products : readLS("rilito-products", allProducts));
      setCategories(ct?.data?.categories?.length ? ct.data.categories : readLS("rilito-categories", defaultCategories));
      setCoupons(cp?.data?.coupons?.length ? cp.data.coupons : defaultCoupons());
      setReviews(rv?.data?.reviews ? rv.data.reviews : readLS("rilito-reviews", []));
      if (st?.data?.settings) setSettings({ ...defaultSettings, ...st.data.settings });

      const [adminMe, customerMe, adminOrders] = await Promise.all([
        api<{ user: ApiUser }>("/auth/me"),
        api<{ user: ApiUser }>("/customer/me"),
        api<{ orders: Order[] }>("/admin/orders"),
      ]);

      if (adminMe?.data?.user) {
        setIsAdmin(true);
        setAdminUser({
          id: String(adminMe.data.user._id ?? adminMe.data.user.id ?? ""),
          name: adminMe.data.user.name ?? "",
          email: adminMe.data.user.email ?? "",
          role: adminMe.data.user.role === "superadmin" ? "superadmin" : "admin",
        });
        if (adminOrders?.data?.orders?.length) setOrders(adminOrders.data.orders);
        else setOrders(readLS("rilito-orders", []));

        const usersRes = await api<{ users: AdminAccount[] }>("/admin/users");
        if (usersRes.data?.users) setAdminUsers(usersRes.data.users);

        const contactRes = await api<{ queries: ContactQuery[] }>("/admin/contact");
        if (contactRes.data?.queries) setContactQueries(contactRes.data.queries);
      } else {
        setOrders(readLS("rilito-orders", []));
      }

      if (customerMe?.data?.user) {
        setUser({
          name: customerMe.data.user.name ?? "",
          email: customerMe.data.user.email ?? "",
          phone: customerMe.data.user.phone ?? "",
          address: customerMe.data.user.address ?? "",
          city: customerMe.data.user.city ?? "",
        });
      }

      setReady(true);
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem("rilito-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem("rilito-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem("rilito-orders", JSON.stringify(orders));
  }, [orders]);

  const toast = useCallback(
    (title: string, description?: string, variant: Toast["variant"] = "success") => {      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const addToCart = useCallback(
    (product: Product, size: string, color: string, qty: number) => {
      const key = `${product.id}-${size}-${color}`;
      setCart((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0],
            price: product.salePrice ?? product.price,
            size,
            color,
            qty,
          },
        ];
      });
      setCartOpen(true);
    },
    []
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty * i.price, 0),
    [cart]
  );

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const isWishlisted = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const register = useCallback(async (data: User & { password: string}) => {
    const res = await api<{ user: ApiUser }>("/customer/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.data?.user) return { ok: false, error: res.error ?? "Registration failed" };
    setUser({
      name: res.data.user.name ?? "",
      email: res.data.user.email ?? "",
      phone: res.data.user.phone ?? "",
      address: res.data.user.address ?? "",
      city: res.data.user.city ?? "",
    });
    localStorage.setItem("rilito-session", JSON.stringify({ email: res.data.user.email }));
    return { ok: true, error: null };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ user: ApiUser }>("/customer/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!res.data?.user) return { ok: false, error: res.error ?? "Login failed" };
    setUser({
      name: res.data.user.name ?? "",
      email: res.data.user.email ?? "",
      phone: res.data.user.phone ?? "",
      address: res.data.user.address ?? "",
      city: res.data.user.city ?? "",
    });
    localStorage.setItem("rilito-session", JSON.stringify({ email: res.data.user.email }));
    return { ok: true, error: null };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("rilito-session");
    api("/auth/logout", { method: "POST" });
  }, []);

  const updateProfile = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
    api("/customer/me", { method: "PATCH", body: JSON.stringify(patch) });
  }, []);

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const res = await api<{ user: ApiUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!res.data?.user) return { ok: false, error: res.error ?? "Login failed" };
    setIsAdmin(true);
    setAdminUser({
      id: String(res.data.user._id ?? res.data.user.id ?? ""),
      name: res.data.user.name ?? "",
      email: res.data.user.email ?? "",
      role: res.data.user.role === "superadmin" ? "superadmin" : "admin",
    });
    return { ok: true, error: null };
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    setAdminUser(null);
    api("/auth/logout", { method: "POST" });
  }, []);

  const isSuperadmin = adminUser?.role === "superadmin";

  const addAdminUser = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const res = await api<{ user: AdminAccount; error?: string }>("/admin/users", {
        method: "POST",
        body: JSON.stringify(input),
      });
      const created = res.data?.user;
      if (created) {
        setAdminUsers((prev) => [...prev, created]);
        return { ok: true };
      }
      return { ok: false, error: res.error ?? "Could not add user" };
    },
    []
  );

  const updateAdminUser = useCallback(
    async (id: string, patch: { name?: string; role?: string; password?: string }) => {
      const res = await api<{ user: AdminAccount; error?: string }>(
        `/admin/users/${id}`,
        { method: "PATCH", body: JSON.stringify(patch) }
      );
      const updated = res.data?.user;
      if (updated) {
        setAdminUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        if (adminUser?.id === id) {
          setAdminUser(updated);
          if (patch.role) setIsAdmin(true);
        }
        return { ok: true };
      }
      return { ok: false, error: res.error ?? "Could not update user" };
    },
    [adminUser]
  );

  const deleteAdminUser = useCallback(async (id: string) => {
    const res = await api<{ ok?: boolean; error?: string }>(`/admin/users/${id}`, {
      method: "DELETE",
    });
    if (res.data?.ok) {
      setAdminUsers((prev) => prev.filter((u) => u.id !== id));
      return { ok: true };
    }
    return { ok: false, error: res.error ?? "Could not delete user" };
  }, []);

  const saveProduct = useCallback((product: Product) => {
    const isNew = !product.id || !products.some((p) => p.id === product.id);
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [...prev, product];
    });
    if (isNew) {
      api("/admin/products", { method: "POST", body: JSON.stringify(product) });
    } else {
      api(`/admin/products/${product.id}`, { method: "PATCH", body: JSON.stringify(product) });
    }
  }, [products]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, deleted: true } : p)));
    api(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify({ deleted: true }) });
  }, []);

  const restoreProduct = useCallback((id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, deleted: false } : p)));
    api(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify({ deleted: false }) });
  }, []);

  const permanentlyDeleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    api(`/admin/products/${id}`, { method: "DELETE" });
  }, []);

  const isSkuTaken = useCallback(
    (sku: string, excludeId?: string) => {
      const normalized = sku.trim().toUpperCase();
      return products.some(
        (p) => p.sku.trim().toUpperCase() === normalized && p.id !== excludeId
      );
    },
    [products]
  );

  const saveCategory = useCallback((category: Category) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.slug === category.slug);
      return exists
        ? prev.map((c) => (c.slug === category.slug ? category : c))
        : [...prev, category];
    });
    const isNew = !categories.some((c) => c.slug === category.slug);
    if (isNew) {
      api("/admin/categories", {
        method: "POST",
        body: JSON.stringify({
          slug: category.slug,
          name: category.name,
          tagline: category.tagline,
          image: category.image,
          accent: category.accent,
        }),
      });
    } else {
      api(`/admin/categories/${category.slug}`, {
        method: "PATCH",
        body: JSON.stringify(category),
      });
    }
  }, [categories]);

  const deleteCategory = useCallback(
    (slug: string) => {
      const inUse = products.some((p) => p.category === slug && !p.deleted);
      if (inUse) return false;
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
      api(`/admin/categories/${slug}`, { method: "DELETE" });
      return true;
    },
    [products]
  );

  const submitReview = useCallback((review: Review) => {
    setReviews((prev) => [...prev, review]);
    api("/reviews", {
      method: "POST",
      body: JSON.stringify({
        productId: review.productId,
        author: review.author,
        rating: review.rating,
        title: review.title,
        bodyText: review.body,
        verified: review.verified,
      }),
    });
  }, []);

  const setReviewStatus = useCallback((id: string, status: Review["status"]) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    api("/admin/reviews", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
  }, []);

  const saveSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    api("/admin/settings", { method: "PATCH", body: JSON.stringify(patch) });
  }, []);

  const saveHeroSlide = useCallback((slide: HeroSlide) => {
    setSettings((prev) => {
      const exists = prev.heroSlides.some((s) => s.id === slide.id);
      const nextOrder = exists
        ? slide.order
        : prev.heroSlides.length > 0
        ? Math.max(...prev.heroSlides.map((s) => s.order)) + 1
        : 1;
      const heroSlides = exists
        ? prev.heroSlides.map((s) => (s.id === slide.id ? { ...slide, order: s.order } : s))
        : [
            ...prev.heroSlides,
            { ...slide, id: slide.id || `slide-${Date.now()}`, order: nextOrder },
          ];
      persistHeroSlides(heroSlides);
      return { ...prev, heroSlides };
    });
  }, []);

  const deleteHeroSlide = useCallback((id: string) => {
    setSettings((prev) => {
      const heroSlides = prev.heroSlides
        .filter((s) => s.id !== id)
        .sort((a, b) => a.order - b.order)
        .map((s, i) => ({ ...s, order: i + 1 }));
      persistHeroSlides(heroSlides);
      return { ...prev, heroSlides };
    });
  }, []);

  const reorderHeroSlide = useCallback((id: string, dir: -1 | 1) => {
    setSettings((prev) => {
      const sorted = [...prev.heroSlides].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swap];
      sorted[idx] = { ...b, order: a.order };
      sorted[swap] = { ...a, order: b.order };
      const heroSlides = sorted.sort((x, y) => x.order - y.order);
      persistHeroSlides(heroSlides);
      return { ...prev, heroSlides };
    });
  }, []);

  const saveCoupon = useCallback((coupon: Coupon) => {
    setCoupons((prev) => {
      const exists = prev.some((c) => c.code === coupon.code);
      return exists
        ? prev.map((c) => (c.code === coupon.code ? coupon : c))
        : [...prev, coupon];
    });
    const isNew = !coupons.some((c) => c.code === coupon.code);
    if (isNew) {
      api("/admin/coupons", {
        method: "POST",
        body: JSON.stringify(coupon),
      });
    } else {
      api(`/admin/coupons/${coupon.code}`, {
        method: "PATCH",
        body: JSON.stringify(coupon),
      });
    }
  }, [coupons]);

  const deleteCoupon = useCallback((code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    api(`/admin/coupons/${code}`, { method: "DELETE" });
  }, []);

  const placeOrder = useCallback(
    async (order: Omit<Order, "id" | "date" | "status" | "total">): Promise<Order> => {
      const newOrder: Order = {
        ...order,
        id: `RIL-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(
          Math.random() * 90 + 10
        )}`,
        date: new Date().toISOString(),
        status: "Order Placed",
        total: order.subtotal - order.discount + order.shipping,
      };
      setOrders((prev) => [newOrder, ...prev]);
      api("/orders", { method: "POST", body: JSON.stringify(newOrder) });
      return newOrder;
    },
    []
  );

  const updateOrderStatus = useCallback((id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    api(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  }, []);

  const updateOrderTracking = useCallback(
    (id: string, tracking: { courier: string; trackingId: string; note: string }) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, tracking } : o)));
      api(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ tracking }),
      });
    },
    []
  );

  const markContactQuery = useCallback((id: string, read: boolean) => {
    setContactQueries((prev) => prev.map((q) => (q.id === id ? { ...q, read } : q)));
    api("/admin/contact", { method: "PATCH", body: JSON.stringify({ id, read }) });
  }, []);

  const deleteContactQuery = useCallback((id: string) => {
    setContactQueries((prev) => prev.filter((q) => q.id !== id));
    api("/admin/contact", { method: "DELETE", body: JSON.stringify({ id }) });
  }, []);

  const deletedProducts = useMemo(
    () => products.filter((p) => p.deleted),
    [products]
  );
  const activeProducts = useMemo(
    () => products.filter((p) => !p.deleted),
    [products]
  );

  const value: StoreContextValue = {
    ready,
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    cartOpen,
    setCartOpen,
    wishlist,
    toggleWishlist,
    isWishlisted,
    searchOpen,
    setSearchOpen,
    mobileOpen,
    setMobileOpen,
    user,
    register,
    login,
    logout,
    updateProfile,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    adminUser,
    adminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    isSuperadmin,
    products: activeProducts,
    deletedProducts,
    saveProduct,
    deleteProduct,
    restoreProduct,
    permanentlyDeleteProduct,
    isSkuTaken,
    categories,
    saveCategory,
    deleteCategory,
    reviews,
    submitReview,
    setReviewStatus,
    settings,
    saveSettings,
    saveHeroSlide,
    deleteHeroSlide,
    reorderHeroSlide,
    coupons,
    saveCoupon,
    deleteCoupon,
    orders,
    placeOrder,
    updateOrderStatus,
    updateOrderTracking,
    contactQueries,
    markContactQuery,
    deleteContactQuery,
    toast,
    toasts,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
