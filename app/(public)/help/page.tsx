import Image from "next/image"

import helpCoffeeImage from "@/assets/images/help-coffee.jpg"
import helpFollowImage from "@/assets/images/help-follow.png"
import helpWantImage from "@/assets/images/help-want.png"

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-6xl pb-8">
      <h1 className="mt-10 p-4 title-font text-3xl font-medium text-indigo-700">
        Bean Stampの使い方
      </h1>
      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:gap-8">
        <div className="public-image-panel order-1">
          <Image
            src={helpFollowImage}
            alt="フォローの画像"
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
        <div className="order-2">
          <h2 className="border-b border-gray-500 pl-4 pt-2 text-lg lg:pt-8">
            ロースターをフォローしよう！
          </h2>
          <p className="mb-8 px-4 pt-2 leading-relaxed tracking-wide lg:pt-8">
            お気に入りのロースターを見つけたら早速フォローしましょう。フォローすることでロースターからあなたにコーヒー豆の招待が届きます。
          </p>
        </div>
        <div className="order-4 lg:order-3">
          <h2 className="border-b border-gray-500 pl-4 pt-2 text-lg lg:pt-8">
            ”オファー”に”ウォント”しよう
          </h2>
          <p className="mb-8 px-4 pt-2 leading-relaxed tracking-wide lg:pt-8">
            ロースターからのオファーには生豆の情報がたくさん！
            <br />
            気になるコーヒー豆があったら手を挙げましょう。
            <br />
            「ウォント!」
            <br />
            そのサインを持ってロースターはあなたのコーヒー豆を焙煎する準備が整います。
          </p>
        </div>
        <div className="public-image-panel order-3 lg:order-4">
          <Image
            src={helpWantImage}
            alt="ウォントの画像"
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div className="public-image-panel order-5">
          <Image
            src={helpCoffeeImage}
            alt="コーヒーの画像"
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div className="order-6">
          <h2 className="border-b border-gray-500 pl-4 pt-2 text-lg lg:pt-8">
            お店に焙煎豆を取りに行こう！
          </h2>
          <p className="mb-8 px-4 pt-2 leading-relaxed tracking-wide lg:pt-8">
            予定した日にちになるとロースターはあなたが「ウォント」したコーヒー豆を焙煎して用意しています。さっそくお店に立ち寄って焙煎したてのコーヒー豆を受け取りましょう。まさにあなたのために焙煎された新鮮なコーヒー豆です！
            美味しいうちに楽しんでくださいね!!
          </p>
        </div>
      </div>
    </div>
  )
}
