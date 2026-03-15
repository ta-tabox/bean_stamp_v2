import type { FC } from 'react'

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

type Props = {
  beanName: string
  imageUrls: string[]
}

export const BeanImagesSwiper: FC<Props> = (props) => {
  const { beanName, imageUrls } = props
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      navigation
      pagination={{ clickable: true, dynamicBullets: true }}
      className="w-full h-full"
    >
      {imageUrls.map((imageUrl) => (
        <SwiperSlide key={imageUrl}>
          <img
            src={imageUrl}
            alt={`${beanName}の画像`}
            className="swiper-slide object-cover object-center rounded-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
