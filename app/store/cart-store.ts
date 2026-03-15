"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  quantity: number;
  categoryName?: string;
  variantName?: string | null;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "id">, quantity?: number) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
};

function buildCartItemId(productId: string, variantId?: string | null) {
  return `${productId}__${variantId ?? "default"}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const cartItemId = buildCartItemId(item.productId, item.variantId);

        const existingItem = get().items.find((cartItem) => cartItem.id === cartItemId);

        if (existingItem) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.id === cartItemId
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            {
              ...item,
              id: cartItemId,
              quantity,
            },
          ],
        });
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      increaseQuantity: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        });
      },

      decreaseQuantity: (id) => {
        set({
          items: get().items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "petsaco-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);