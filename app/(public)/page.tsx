import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import topImage from "@/assets/images/top-image.jpg"
import { getSessionPrincipal } from "@/server/auth/guards"

export default async function PublicHomePage() {
  const session = await getSessionPrincipal()

  if (session) {
    redirect("/users/home")
  }

  return (
    <div className="top-background relative min-h-[calc(100vh-3.5rem)]">
      <Image
        src={topImage}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-white/20" />
      <section className="absolute left-1/2 top-1/2 flex w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 justify-center px-4 lg:left-2/3">
        <section className="public-hero-card">
          <hr className="mx-auto w-48 border-2 border-indigo-500" />
          <h2 className="mt-8 text-center text-sm text-yellow-800 sm:mt-16 sm:text-lg">
            あなたにとっての一杯のコーヒー
            <br />
            探していきませんか？
          </h2>
          <h1 className="logo-font my-4 text-center text-4xl font-bold text-gray-800 sm:text-5xl">
            Bean Stamp
          </h1>
          <Link
            href="/auth/signup"
            className="btn btn-primary mt-2 w-52 text-xl sm:mt-4 sm:w-56"
          >
            登録する
          </Link>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/auth/signin"
              className="btn btn-secondary w-52 sm:w-56"
            >
              サインイン
            </Link>
          </div>
        </section>
      </section>
    </div>
  )
}
