import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  variant?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQty: (id: string, qty: number, variant?: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id && i.variant === item.variant);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              (i.id === item.id && i.variant === item.variant) ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          set((s) => ({ items: [...s.items, { ...item, quantity: 1 }] }));
        }
      },
      removeItem: (id, variant) =>
        set((s) => ({ items: s.items.filter((i) => !(i.id === id && i.variant === variant)) })),
      updateQty: (id, qty, variant) => {
        if (qty <= 0) {
          set((s) => ({ items: s.items.filter((i) => !(i.id === id && i.variant === variant)) }));
        } else {
          set((s) => ({
            items: s.items.map((i) =>
              (i.id === id && i.variant === variant) ? { ...i, quantity: qty } : i
            ),
          }));
        }
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "sweetmelt-cart" }
  )
);
