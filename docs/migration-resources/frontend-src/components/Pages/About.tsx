import type { FC } from 'react'
import { memo } from 'react'

import cherryImage from '@/assets/images/about-cherry.jpg'
import coffeeImage from '@/assets/images/about-coffee.jpg'
import { Head } from '@/components/Head'

export const About: FC = memo(() => (
  <>
    <Head title="About" />
    <div className="container mx-auto pb-8">
      <h1 className="mt-10 p-4 title-font text-indigo-700 font-medium text-3xl">Bean Stampとは</h1>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-xl max-h-96 overflow-hidden order-1">
          <img src={cherryImage} alt="コーヒーチェリーの画像" className="w-full" />
        </div>
        <div className="order-2">
          <h2 className="pl-4 pt-2 lg:pt-8 border-b border-gray-500 text-lg">コーヒーはフルーツ！</h2>
          <p className="pt-2 lg:pt-8 px-4 mb-8 leading-relaxed tracking-wide">
            遠く離れた国々で赤々と熟したコーヒーの実はコーヒービーンズに精製されて日本にやってきます。
            コーヒーの生豆はコーヒーロースターに焙煎されることで香りが花開きます。
            まるでフルーツがパティシエの手により美味しいケーキに生まれ変わるように。
            そして農作物であるコーヒー豆は他の様々なフルーツと同じく、美味しい「期間」があります。
          </p>
        </div>
        <div className="order-4 lg:order-3">
          <h2 className="pl-4 pt-2 lg:pt-8 border-b border-gray-500 text-lg">ロースターはパートナー</h2>
          <p className="pt-2 lg:pt-8 px-4 mb-8 leading-relaxed tracking-wide">
            焙煎したコーヒー豆をおいしく味わえる期間は豆の状態で1ヶ月、粉に挽いてしまうと1週間、なんて言われています。
            焙煎して一番美味しい状態のコーヒー豆を提案してくれるロースターは、あなたのコーヒーライフにとってまさに「パートナー」。
            BEANSであなたにとってのパートナーを探しに行きましょう!
          </p>
        </div>
        <div className="rounded-xl max-h-96 overflow-hidden order-3 lg:order-4">
          <img src={coffeeImage} alt="コーヒーの画像" className="w-full" />
        </div>
      </div>
    </div>
  </>
))
