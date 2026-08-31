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
  variant?: "success" | "info";
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
  register: (user: User & { password: string }) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
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

async function api<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`/api${path}`, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

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

      setProducts(pd?.products?.length ? pd.products : readLS("rilito-products", allProducts));
      setCategories(ct?.categories?.length ? ct.categories : readLS("rilito-categories", defaultCategories));
      setCoupons(cp?.coupons?.length ? cp.coupons : defaultCoupons());
      setReviews(rv?.reviews ? rv.reviews : readLS("rilito-reviews", []));
      if (st?.settings) setSettings({ ...defaultSettings, ...st.settings });

      const [adminMe, customerMe, adminOrders] = await Promise.all([
        api<{ user: ApiUser }>("/auth/me"),
        api<{ user: ApiUser }>("/customer/me"),
        api<{ orders: Order[] }>("/admin/orders"),
      ]);

      if (adminMe?.user) {
        setIsAdmin(true);
        setAdminUser({
          id: String(adminMe.user._id ?? adminMe.user.id ?? ""),
          name: adminMe.user.name ?? "",
          email: adminMe.user.email ?? "",
          role: adminMe.user.role === "superadmin" ? "superadmin" : "admin",
        });
        if (adminOrders?.orders?.length) setOrders(adminOrders.orders);
        else setOrders(readLS("rilito-orders", []));

        const usersRes = await api<{ users: AdminAccount[] }>("/admin/users");
        if (usersRes?.users) setAdminUsers(usersRes.users);

        const contactRes = await api<{ queries: ContactQuery[] }>("/admin/contact");
        if (contactRes?.queries) setContactQueries(contactRes.queries);
      } else {
        setOrders(readLS("rilito-orders", []));
      }

      if (customerMe?.user) {
        setUser({
          name: customerMe.user.name ?? "",
          email: customerMe.user.email ?? "",
          phone: customerMe.user.phone ?? "",
          address: customerMe.user.address ?? "",
          city: customerMe.user.city ?? "",
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
    (title: string, description?: string, variant: Toast["variant"] = "success") => {
      const id = Date.now() + Math.random();
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
    if (!res?.user) return false;
    setUser({
      name: res.user.name ?? "",
      email: res.user.email ?? "",
      phone: res.user.phone ?? "",
      address: res.user.address ?? "",
      city: res.user.city ?? "",
    });
    localStorage.setItem("rilito-session", JSON.stringify({ email: res.user.email }));
    return true;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ user: ApiUser }>("/customer/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!res?.user) return false;
    setUser({
      name: res.user.name ?? "",
      email: res.user.email ?? "",
      phone: res.user.phone ?? "",
      address: res.user.address ?? "",
      city: res.user.city ?? "",
    });
    localStorage.setItem("rilito-session", JSON.stringify({ email: res.user.email }));
    return true;
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
    if (!res?.user) return false;
    setIsAdmin(true);
    setAdminUser({
      id: String(res.user._id ?? res.user.id ?? ""),
      name: res.user.name ?? "",
      email: res.user.email ?? "",
      role: res.user.role === "superadmin" ? "superadmin" : "admin",
    });
    return true;
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
      if (res?.user) {
        setAdminUsers((prev) => [...prev, res.user]);
        return { ok: true };
      }
      return { ok: false, error: res?.error ?? "Could not add user" };
    },
    []
  );

  const updateAdminUser = useCallback(
    async (id: string, patch: { name?: string; role?: string; password?: string }) => {
      const res = await api<{ user: AdminAccount; error?: string }>(
        `/admin/users/${id}`,
        { method: "PATCH", body: JSON.stringify(patch) }
      );
      if (res?.user) {
        setAdminUsers((prev) => prev.map((u) => (u.id === id ? res.user : u)));
        if (adminUser?.id === id) {
          setAdminUser(res.user);
          if (patch.role) setIsAdmin(true);
        }
        return { ok: true };
      }
      return { ok: false, error: res?.error ?? "Could not update user" };
    },
    [adminUser]
  );

  const deleteAdminUser = useCallback(async (id: string) => {
    const res = await api<{ ok?: boolean; error?: string }>(`/admin/users/${id}`, {
      method: "DELETE",
    });
    if (res?.ok) {
      setAdminUsers((prev) => prev.filter((u) => u.id !== id));
      return { ok: true };
    }
    return { ok: false, error: res?.error ?? "Could not delete user" };
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
