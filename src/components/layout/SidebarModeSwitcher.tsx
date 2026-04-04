"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

type SidebarModeSwitcherProps = {
  isRoasterRoute: boolean
  roasterId?: string | null
  roasterImageUrl?: string | null
  roasterName?: string | null
  userImageUrl?: string | null
  userName: string
}

export function SidebarModeSwitcher({
  isRoasterRoute,
  roasterId,
  roasterImageUrl,
  roasterName,
  userImageUrl,
  userName,
}: SidebarModeSwitcherProps) {
  if (!roasterId) {
    return (
      <div className="h-20 w-20 text-center text-sm">
        <p className="text-xs text-gray-500">ロースターを</p>
        <Link
          href="/roasters/new"
          className="legacy-text-link text-sm"
        >
          登録する
        </Link>
      </div>
    )
  }

  const href = isRoasterRoute ? "/users/home" : "/roasters/home"
  const switchTarget = isRoasterRoute ? "ユーザーへ" : "ロースターへ"
  const imageUrl = isRoasterRoute
    ? (userImageUrl ?? "/images/default-user.png")
    : (roasterImageUrl ?? "/images/default-roaster.png")
  const imageAlt = `${isRoasterRoute ? userName : (roasterName ?? "ロースター")}のホームへのリンクの画像`

  return (
    <div className="text-center">
      <Link
        href={href}
        className="inline-block"
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="h-20 w-20 rounded-full border-2 border-indigo-500 object-cover"
        />
      </Link>
      <p className="mx-auto mt-2 text-xs font-light leading-5 text-gray-500">
        {switchTarget}
        <br />
        切り替える
      </p>
    </div>
  )
}
