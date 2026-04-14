export type ToastStatus = "error" | "success"

type ToastStatusMeta = {
  ariaLive: "assertive" | "polite"
  role: "alert" | "status"
}

const toastStatusMeta: Record<ToastStatus, ToastStatusMeta> = {
  error: {
    ariaLive: "assertive",
    role: "alert",
  },
  success: {
    ariaLive: "polite",
    role: "status",
  },
}

export function getToastStatusMeta(status: ToastStatus): ToastStatusMeta {
  return toastStatusMeta[status]
}
