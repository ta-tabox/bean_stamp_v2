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

type ToastPhase = "entering" | "visible" | "leaving"

type ToastContextValue = {
  showToast: (message: string, tone: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const [toastPhase, setToastPhase] = useState<ToastPhase>("entering")
  const toastIdRef = useRef(0)

  useEffect(() => {
    if (!toast) {
      return
    }

    const enterTimeoutId = window.setTimeout(() => {
      setToastPhase((currentPhase) => {
        if (currentPhase !== "entering") {
          return currentPhase
        }

        return "visible"
      })
    }, 20)

    const leaveTimeoutId = window.setTimeout(() => {
      setToastPhase((currentPhase) => {
        if (currentPhase === "leaving") {
          return currentPhase
        }

        return "leaving"
      })
    }, 3600)

    const removeTimeoutId = window.setTimeout(() => {
      setToast((currentToast) => {
        if (!currentToast || currentToast.id !== toast.id) {
          return currentToast
        }

        return null
      })
    }, 4000)

    return () => {
      window.clearTimeout(enterTimeoutId)
      window.clearTimeout(leaveTimeoutId)
      window.clearTimeout(removeTimeoutId)
    }
  }, [toast])

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      showToast(message, tone) {
        toastIdRef.current += 1
        setToastPhase("entering")
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
        <div className="toast-viewport">
          <div
            role={toast.tone === "error" ? "alert" : "status"}
            aria-live={toast.tone === "error" ? "assertive" : "polite"}
            className={`toast-shell toast-shell-${toastPhase}`}
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
