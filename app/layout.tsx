import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Bean Stamp Next.js",
  description: "Bean Stamp の Next.js 置換版",
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        {children}
      </body>
    </html>
  )
}
