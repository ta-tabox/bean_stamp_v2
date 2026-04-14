import type { ReactNode } from "react"

type StatusBannerProps = {
  children: ReactNode
  tone?: "default" | "error" | "success"
}

export function StatusBanner({ children, tone = "default" }: StatusBannerProps) {
  return <div className={`status-banner status-banner-${tone}`}>{children}</div>
}
