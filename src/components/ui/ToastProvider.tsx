"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { StatusBanner } from "@/components/ui/StatusBanner"

type ToastTone = "error" | "success"

type ToastState = {
  id: number
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  showToast: (message: string, tone: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const toastIdRef = useRef(0)

  useEffect(() => {
    if (!toast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setToast((currentToast) => {
        if (!currentToast || currentToast.id !== toast.id) {
          return currentToast
        }

        return null
      })
    }, 4000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toast])

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      showToast(message, tone) {
        toastIdRef.current += 1
        setToast({
          id: toastIdRef.current,
          message,
          tone,
        })
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <div
            role={toast.tone === "error" ? "alert" : "status"}
            aria-live={toast.tone === "error" ? "assertive" : "polite"}
            className="w-full max-w-2xl"
          >
            <StatusBanner>
              <span className={toast.tone === "error" ? "text-rose-700" : undefined}>
                {toast.message}
              </span>
            </StatusBanner>
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }

  return context
}
