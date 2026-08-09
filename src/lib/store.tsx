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
import type { CartItem, Order, Product, User } from "./types";
import { generateOrderId } from "@/features/order/data/status";

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
  register: (user: User & { password: string }) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "date" | "status" | "total">) => Order;
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    setCart(readLS("rilito-cart", []));
    setWishlist(readLS("rilito-wishlist", []));
    setOrders(readLS("rilito-orders", []));
    const session = readLS<{ email: string } | null>("rilito-session", null);
    if (session) {
      const users = readLS<Array<User & { password: string }>>("rilito-users", []);
      const match = users.find((u) => u.email === session.email);
      if (match) {
        const { password: _pw, ...rest } = match;
        setUser(rest);
      }
    }
    setReady(true);
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

  const toggleWishlist = useCallback(
    (slug: string) => {
      setWishlist((prev) => {
        const has = prev.includes(slug);
        return has ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    []
  );

  const isWishlisted = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const register = useCallback(
    (data: User & { password: string }) => {
      const users = readLS<Array<User & { password: string }>>("rilito-users", []);
      if (users.some((u) => u.email === data.email)) return false;
      const next = [...users, data];
      localStorage.setItem("rilito-users", JSON.stringify(next));
      const { password: _pw, ...rest } = data;
      setUser(rest);
      localStorage.setItem("rilito-session", JSON.stringify({ email: data.email }));
      return true;
    },
    []
  );

  const login = useCallback((email: string, password: string) => {
    const users = readLS<Array<User & { password: string }>>("rilito-users", []);
    const match = users.find((u) => u.email === email && u.password === password);
    if (!match) return false;
    const { password: _pw, ...rest } = match;
    setUser(rest);
    localStorage.setItem("rilito-session", JSON.stringify({ email }));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("rilito-session");
  }, []);

  const updateProfile = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      const users = readLS<Array<User & { password: string }>>("rilito-users", []);
      localStorage.setItem(
        "rilito-users",
        JSON.stringify(users.map((u) => (u.email === prev.email ? { ...u, ...patch } : u)))
      );
      return next;
    });
  }, []);

const placeOrder = useCallback(
    (order: Omit<Order, "id" | "date" | "status" | "total">): Order => {
      const newOrder: Order = {
        ...order,
        id: generateOrderId(),
        date: new Date().toISOString(),
        status: "Order Placed",
        total: order.subtotal - order.discount + order.shipping,
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    []
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
    orders,
    placeOrder,
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