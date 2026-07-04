import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "bloomery:cart";
const FAVORITES_KEY = "bloomery:favorites";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(STORAGE_KEY, []));
  const [favorites, setFavorites] = useState(() => readStorage(FAVORITES_KEY, []));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addItem = useCallback((flower, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === flower.id);
      if (existing) {
        return prev.map((i) => (i.id === flower.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id: flower.id, name: flower.name, image: flower.image, price: flower.price, qty }];
    });
    // id makes each toast unique so repeated adds retrigger the popup animation.
    setToast({ id: Date.now(), message: `${flower.name} added to your bouquet` });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const value = useMemo(() => {
    const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return {
      items,
      favorites,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      toggleFavorite,
      totalCount,
      totalPrice,
      toast,
      dismissToast,
    };
  }, [items, favorites, addItem, removeItem, updateQty, clearCart, toggleFavorite, toast, dismissToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
