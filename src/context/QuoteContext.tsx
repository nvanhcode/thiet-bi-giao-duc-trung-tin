"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";
import { QuoteItem } from "@/types/quote-request";

interface QuoteContextType {
  items: QuoteItem[];
  addToQuote: (product: Product, quantity?: number) => void;
  removeFromQuote: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearQuote: () => void;
  itemCount: number;
  toastMessage: string | null;
  closeToast: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "thiet_bi_giao_duc_quote_items";

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Lỗi đọc quote storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Lỗi ghi quote storage:", e);
    }
  }, [items, isLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const addToQuote = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        const newItem: QuoteItem = {
          id: product.id,
          name: product.name,
          code: product.code,
          slug: product.slug,
          image: product.thumbnail || (product.images && product.images[0]) || "",
          price: product.price,
          oldPrice: product.oldPrice,
          quantity,
          summary: product.summary,
          description: product.description,
          specifications: product.specifications,
          origin: product.origin,
          investmentLevel: product.investmentLevel,
          blockCount: product.blockCount,
          slideType: product.slideType,
          feature: product.feature,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Đã thêm "${product.name}" vào danh sách báo giá!`);
  };

  const removeFromQuote = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearQuote = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <QuoteContext.Provider
      value={{
        items,
        addToQuote,
        removeFromQuote,
        updateQuantity,
        clearQuote,
        itemCount,
        toastMessage,
        closeToast: () => setToastMessage(null),
      }}
    >
      {children}
      {/* Global Toast for Adding Items */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold">{toastMessage}</p>
            <a href="/bao-gia" className="text-[11px] text-red-400 hover:underline font-semibold block mt-0.5">
              Xem danh sách báo giá →
            </a>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white text-xs ml-2 font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
}
