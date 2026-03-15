import type { FC } from 'react'
import { memo } from 'react'

import coffeeImage from '@/assets/images/help-coffee.jpg'
import followImage from '@/assets/images/help-follow.png'
import wantsImage from '@/assets/images/help-want.png'
import { Head } from '@/components/Head'

export const Help: FC = memo(() => (
  <>
    <Head title="Help" />
    <div className="container mx-auto pb-8">
      <h1 className="mt-10 p-4 title-font text-indigo-700 font-medium text-3xl">Bean Stampの使い方</h1>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-xl max-h-96 overflow-hidden order-1">
          <img src={followImage} alt="フォローの画像" className="w-full" />
        </div>
        <div className="order-2">
          <h2 className="pl-4 pt-2 lg:pt-8 border-b border-gray-500 text-lg">ロースターをフォローしよう！</h2>
          <p className="pt-2 lg:pt-8 px-4 mb-8 leading-relaxed tracking-wide">
            お気に入りのロースターを見つけたら早速フォローしましょう。
            フォローすることでロースターからあなたにコーヒー豆の招待が届きます。
          </p>
        </div>
        <div className="order-4 lg:order-3">
          <h2 className="pl-4 pt-2 lg:pt-8 border-b border-gray-500 text-lg">”オファー”に”ウォント”しよう</h2>
          <p className="pt-2 lg:pt-8 px-4 mb-8 leading-relaxed tracking-wide">
            ロースターからのオファーには生豆の情報がたくさん！
            <br />
            気になるコーヒー豆があったら手を挙げましょう。
            <br />
            「ウォント!」
            <br />
            そのサインを持ってロースターはあなたのコーヒー豆を焙煎する準備が整います。
          </p>
        </div>
        <div className="rounded-xl max-h-96 overflow-hidden order-3 lg:order-4">
          <img src={wantsImage} alt="ウォントの画像" className="w-full" />
        </div>
        <div className="rounded-xl max-h-96 overflow-hidden order-5">
          <img src={coffeeImage} alt="コーヒーの画像" className="w-full" />
        </div>
        <div className="order-6">
          <h2 className="pl-4 pt-2 lg:pt-8 border-b border-gray-500 text-lg">お店に焙煎豆を取りに行こう！</h2>
          <p className="pt-2 lg:pt-8 px-4 mb-8 leading-relaxed tracking-wide">
            予定した日にちになるとロースターはあなたが「ウォント」したコーヒー豆を焙煎して用意しています。
            さっそくお店に立ち寄って焙煎したてのコーヒー豆を受け取りましょう。
            まさにあなたのために焙煎された新鮮なコーヒー豆です！ 美味しいうちに楽しんでくださいね!!
          </p>
        </div>
      </div>
    </div>
  </>
))
