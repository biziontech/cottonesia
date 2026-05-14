// lib/use-cart.js
"use client"
import { useState, useEffect, useCallback } from "react"

const KEY = "cottonesia_cart"

export function useCart() {
  const [items, setItems] = useState([])
  const [mounted, setMounted] = useState(false)
  const [toast, setToast] = useState({ visible: false, item: null })
  const [cartBump, setCartBump] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setMounted(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
  }, [items, mounted])

  const addItem = useCallback((product) => {
    const key = `${product.id}_${product.color}_${product.size}`
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.key === key)
      if (idx > -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + (product.qty ?? 1) }
        return next
      }
      return [...prev, { ...product, key }]
    })
    // Show toast
    setToast({ visible: true, item: product })
    setTimeout(() => setToast({ visible: false, item: null }), 3200)
    // Bump cart icon
    setCartBump(true)
    setTimeout(() => setCartBump(false), 600)
  }, [])

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    subtotal,
    toast,
    setToast,
    cartBump,
    mounted,
  }
}
