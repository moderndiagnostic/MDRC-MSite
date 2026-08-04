"use client";

import { createContext, useContext, useState } from "react";

type CartContextType = {
  cartCount: number;
  cartSubtotal: number;
  sampleCollect: "Yes" | "No";
  setCartCount: (v: number) => void;
  setCartSubtotal: (v: number) => void;
  setSampleCollect: (v: "Yes" | "No") => void;
  clearCartContext: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [sampleCollect, setSampleCollect] = useState<"Yes" | "No">("No");

  const clearCartContext = () => {
    setCartCount(0);
    setCartSubtotal(0);
    setSampleCollect("No");
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartSubtotal,
        sampleCollect,
        setCartCount,
        setCartSubtotal,
        setSampleCollect,
        clearCartContext,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside CartProvider");
  return ctx;
};
