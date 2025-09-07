"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useToast, type Toast } from "@/hooks/useToast"
import { ToastContainer } from "@/components/ui/toast"

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => string
  removeToast: (id: string) => void
  removeAllToasts: () => void
  success: (title: string, message?: string) => string
  error: (title: string, message?: string) => string
  warning: (title: string, message?: string) => string
  info: (title: string, message?: string) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}
