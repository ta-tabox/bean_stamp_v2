import type { Metadata } from "next"
import { Noto_Sans_JP, Noto_Serif } from "next/font/google"

import favicon from "@/assets/images/favicon.png"
import { IconsSprite } from "@/components/icon/IconsSprite"

import "./globals.css"

const notoSans = Noto_Sans_JP({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "700"],
})

const notoSerif = Noto_Serif({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Bean Stamp Next.js",
  description: "Bean Stamp の Next.js 置換版",
  icons: {
    icon: favicon.src,
  },
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="ja"
      className={`${notoSans.variable} ${notoSerif.variable}`}
    >
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        <IconsSprite />
        {children}
      </body>
    </html>
  )
}
