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
import { getToastStatusMeta, type ToastStatus } from "@/components/ui/toast"

type ToastState = {
  id: number
  message: string
  status: ToastStatus
}

type ToastPhase = "entering" | "visible" | "leaving"

type ToastContextValue = {
  showToast: (message: string, status: ToastStatus) => void
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
        const status = tone

        toastIdRef.current += 1
        setToastPhase("entering")
        setToast({
          id: toastIdRef.current,
          message,
          status,
        })
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toast ? (
        <ToastMessage
          toast={toast}
          toastPhase={toastPhase}
        />
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

type ToastMessageProps = {
  toast: ToastState
  toastPhase: ToastPhase
}

function ToastMessage({ toast, toastPhase }: ToastMessageProps) {
  const meta = getToastStatusMeta(toast.status)

  return (
    <div className="toast-viewport">
      <div
        role={meta.role}
        aria-live={meta.ariaLive}
        className={`toast-shell toast-shell-${toastPhase}`}
      >
        <StatusBanner tone={toast.status}>
          <div className="toast-content">{toast.message}</div>
        </StatusBanner>
      </div>
    </div>
  )
}
