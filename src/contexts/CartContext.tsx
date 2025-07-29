"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        product: Product;
        quantity: number;
        size?: string;
        color?: string;
      };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  addItem: (
    product: Product,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, size, color } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;

        const newState = {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };

        localStorage.setItem("cart", JSON.stringify(newState));
        return newState;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size || "default"}-${color || "default"}`,
          productId: product.id,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
        };

        const newItems = [...state.items, newItem];
        const newState = {
          ...state,
          items: newItems,
          total: newItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        };

        localStorage.setItem("cart", JSON.stringify(newState));
        return newState;
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const newState = {
        ...state,
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };

      localStorage.setItem("cart", JSON.stringify(newState));
      return newState;
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );

      const newState = {
        ...state,
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };

      localStorage.setItem("cart", JSON.stringify(newState));
      return newState;
    }

    case "CLEAR_CART": {
      const newState = {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };

      localStorage.setItem("cart", JSON.stringify(newState));
      return newState;
    }

    case "LOAD_CART": {
      const items = action.payload;
      return {
        ...state,
        items,
        total: items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart.items });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  const addItem = (
    product: Product,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, size, color } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
