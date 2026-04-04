import Image from "next/image"

import aboutCherryImage from "@/assets/images/about-cherry.jpg"
import aboutCoffeeImage from "@/assets/images/about-coffee.jpg"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl pb-8">
      <h1 className="mt-10 p-4 title-font text-3xl font-medium text-indigo-700">Bean Stampとは</h1>
      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:gap-8">
        <div className="public-image-panel order-1">
          <Image
            src={aboutCherryImage}
            alt="コーヒーチェリーの画像"
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
        <div className="order-2">
          <h2 className="border-b border-gray-500 pl-4 pt-2 text-lg lg:pt-8">
            コーヒーはフルーツ！
          </h2>
          <p className="mb-8 px-4 pt-2 leading-relaxed tracking-wide lg:pt-8">
            遠く離れた国々で赤々と熟したコーヒーの実はコーヒービーンズに精製されて日本にやってきます。コーヒーの生豆はコーヒーロースターに焙煎されることで香りが花開きます。まるでフルーツがパティシエの手により美味しいケーキに生まれ変わるように。そして農作物であるコーヒー豆は他の様々なフルーツと同じく、美味しい「期間」があります。
          </p>
        </div>
        <div className="order-4 lg:order-3">
          <h2 className="border-b border-gray-500 pl-4 pt-2 text-lg lg:pt-8">
            ロースターはパートナー
          </h2>
          <p className="mb-8 px-4 pt-2 leading-relaxed tracking-wide lg:pt-8">
            焙煎したコーヒー豆をおいしく味わえる期間は豆の状態で1ヶ月、粉に挽いてしまうと1週間、なんて言われています。焙煎して一番美味しい状態のコーヒー豆を提案してくれるロースターは、あなたのコーヒーライフにとってまさに「パートナー」。BEANSであなたにとってのパートナーを探しに行きましょう!
          </p>
        </div>
        <div className="public-image-panel order-3 lg:order-4">
          <Image
            src={aboutCoffeeImage}
            alt="コーヒーの画像"
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </div>
  )
}
