"use client"

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const removeAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = useCallback(
    (title: string, message?: string) => {
      return addToast({ type: "success", title, message })
    },
    [addToast],
  )

  const error = useCallback(
    (title: string, message?: string) => {
      return addToast({ type: "error", title, message })
    },
    [addToast],
  )

  const warning = useCallback(
    (title: string, message?: string) => {
      return addToast({ type: "warning", title, message })
    },
    [addToast],
  )

  const info = useCallback(
    (title: string, message?: string) => {
      return addToast({ type: "info", title, message })
    },
    [addToast],
  )

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info,
  }
}
