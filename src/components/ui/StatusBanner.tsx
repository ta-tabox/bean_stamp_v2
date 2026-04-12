import type { ReactNode } from "react"

type StatusBannerProps = {
  children: ReactNode
}

export function StatusBanner({ children }: StatusBannerProps) {
  return <div className="status-banner">{children}</div>
}
