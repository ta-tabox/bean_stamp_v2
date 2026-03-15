import type { FC } from 'react'

import { Card, CardContainer } from '@/components/Elements/Card'
import { BeanDetail } from '@/features/beans/components/molecules/BeanDetail'
import { BeanImagesSwiper } from '@/features/beans/components/molecules/BeanImagesSwiper'
import { BeanTasteChart } from '@/features/beans/components/molecules/BeanTasteChart'
import { BeanTasteTags } from '@/features/beans/components/molecules/BeanTasteTags'
import type { Bean } from '@/features/beans/types'

type Props = {
  bean: Bean
}

export const BeanCard: FC<Props> = (props) => {
  const { bean } = props

  return (
    <Card>
      <CardContainer>
        <div className="w-11/12 mx-auto">
          <h1 className="text-center pb-2 text-gray-900 text-xl lg:text-2xl title-font">{bean.name}</h1>
          <div className="flex flex-col justify-center items-center">
            {/* 画像カルーセル */}
            <div className="w-full h-64 lg:w-144 lg:h-96">
              <BeanImagesSwiper imageUrls={bean.imageUrls} beanName={bean.name} />
            </div>

            <div className="text-center lg:w-10/12 w-full pt-4">
              <p className="leading-relaxed">{bean.describe}</p>

              {/* フレーバーのタグ */}
              <section className="w-11/12 mx-auto pt-4">
                <div className="mb-2 text-center text-lg e-font">〜 Flavor 〜</div>
                <BeanTasteTags tastes={bean.taste.names} />
              </section>

              {/* コーヒー豆詳細情報 */}
              <section className="pt-4">
                <div className="mb-2 text-lg e-font">〜 Detail 〜</div>
                <div className="lg:grid content-between grid-cols-2">
                  <BeanDetail bean={bean} />
                </div>
              </section>

              {/* Tasteチャート */}
              <section className="pt-4 h-80 w-80 sm:h-96 sm:w-96 mx-auto relative">
                <div className="text-lg e-font">〜 Taste 〜</div>
                <div className="h-80 w-80 sm:h-96 sm:w-96 absolute top-4 left-3">
                  <BeanTasteChart
                    acidity={bean.acidity}
                    flavor={bean.flavor}
                    body={bean.body}
                    bitterness={bean.bitterness}
                    sweetness={bean.sweetness}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </CardContainer>
    </Card>
  )
}
