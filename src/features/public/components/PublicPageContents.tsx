import type { ComponentProps, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import aboutCherryImage from "@/assets/images/about-cherry.jpg"
import aboutCoffeeImage from "@/assets/images/about-coffee.jpg"
import helpCoffeeImage from "@/assets/images/help-coffee.jpg"
import helpFollowImage from "@/assets/images/help-follow.png"
import helpWantImage from "@/assets/images/help-want.png"
import topImage from "@/assets/images/top-image.jpg"

export function PublicHomePageContent() {
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

export function AboutPageContent() {
  return (
    <div className="mx-auto max-w-6xl pb-8">
      <h1 className="mt-10 p-4 title-font text-3xl font-medium text-indigo-700">Bean Stampとは</h1>
      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:gap-8">
        <PublicImagePanel
          alt="コーヒーチェリーの画像"
          image={aboutCherryImage}
          priority
        />
        <PublicInfoBlock
          title="コーヒーはフルーツ！"
          body="遠く離れた国々で赤々と熟したコーヒーの実はコーヒービーンズに精製されて日本にやってきます。コーヒーの生豆はコーヒーロースターに焙煎されることで香りが花開きます。まるでフルーツがパティシエの手により美味しいケーキに生まれ変わるように。そして農作物であるコーヒー豆は他の様々なフルーツと同じく、美味しい「期間」があります。"
        />
        <PublicInfoBlock
          className="order-4 lg:order-3"
          title="ロースターはパートナー"
          body="焙煎したコーヒー豆をおいしく味わえる期間は豆の状態で1ヶ月、粉に挽いてしまうと1週間、なんて言われています。焙煎して一番美味しい状態のコーヒー豆を提案してくれるロースターは、あなたのコーヒーライフにとってまさに「パートナー」。BEANSであなたにとってのパートナーを探しに行きましょう!"
        />
        <PublicImagePanel
          alt="コーヒーの画像"
          className="order-3 lg:order-4"
          image={aboutCoffeeImage}
        />
      </div>
    </div>
  )
}

export function HelpPageContent() {
  return (
    <div className="mx-auto max-w-6xl pb-8">
      <h1 className="mt-10 p-4 title-font text-3xl font-medium text-indigo-700">
        Bean Stampの使い方
      </h1>
      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:gap-8">
        <PublicImagePanel
          alt="フォローの画像"
          image={helpFollowImage}
          priority
        />
        <PublicInfoBlock
          title="ロースターをフォローしよう！"
          body="お気に入りのロースターを見つけたら早速フォローしましょう。フォローすることでロースターからあなたにコーヒー豆の招待が届きます。"
        />
        <PublicInfoBlock
          className="order-4 lg:order-3"
          title="”オファー”に”ウォント”しよう"
        >
          ロースターからのオファーには生豆の情報がたくさん！
          <br />
          気になるコーヒー豆があったら手を挙げましょう。
          <br />
          「ウォント!」
          <br />
          そのサインを持ってロースターはあなたのコーヒー豆を焙煎する準備が整います。
        </PublicInfoBlock>
        <PublicImagePanel
          alt="ウォントの画像"
          className="order-3 lg:order-4"
          image={helpWantImage}
        />
        <PublicImagePanel
          alt="コーヒーの画像"
          className="order-5"
          image={helpCoffeeImage}
        />
        <PublicInfoBlock
          className="order-6"
          title="お店に焙煎豆を取りに行こう！"
          body="予定した日にちになるとロースターはあなたが「ウォント」したコーヒー豆を焙煎して用意しています。さっそくお店に立ち寄って焙煎したてのコーヒー豆を受け取りましょう。まさにあなたのために焙煎された新鮮なコーヒー豆です！美味しいうちに楽しんでくださいね!!"
        />
      </div>
    </div>
  )
}

function PublicImagePanel({
  alt,
  className = "order-1",
  image,
  priority = false,
}: {
  alt: string
  className?: string
  image: ComponentProps<typeof Image>["src"]
  priority?: boolean
}) {
  return (
    <div className={`public-image-panel ${className}`}>
      <Image
        src={image}
        alt={alt}
        className="h-full w-full object-cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority={priority}
      />
    </div>
  )
}

function PublicInfoBlock({
  body,
  children,
  className = "order-2",
  title,
}: {
  body?: string
  children?: ReactNode
  className?: string
  title: string
}) {
  return (
    <div className={className}>
      <h2 className="border-b border-gray-500 pl-4 pt-2 text-lg lg:pt-8">{title}</h2>
      <p className="mb-8 px-4 pt-2 leading-relaxed tracking-wide lg:pt-8">{body ?? children}</p>
    </div>
  )
}
