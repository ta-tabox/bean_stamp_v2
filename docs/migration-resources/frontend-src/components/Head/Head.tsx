import type { FC } from 'react'

import { Helmet } from 'react-helmet-async'

import favicon from '@/assets/images/favicon.png'
import { APP_NAME, FRONT_ORIGIN } from '@/config'

type HeadProps = {
  title?: string
  description?: string
  path?: string
}

export const Head: FC<HeadProps> = (props) => {
  const { title, description, path } = props

  return (
    <Helmet title={title ? `${title} | ${APP_NAME}` : undefined} defaultTitle={`${APP_NAME}`}>
      <meta name="description" content={description ?? 'Bean Stampはコーヒー愛好家とロースターを繋ぐサービスです。'} />
      <link rel="canonical" href={`${FRONT_ORIGIN}/${path ?? ''}`} />

      {/* TODO アイコン変更する */}
      <link rel="icon" type="image/svg+xml" href={favicon} />
      {/* <a target="_blank" href="https://icons8.com/icon/lOvhiSMwKCwC/artist-palette">Coffee Bean</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* font awesomeの読み込み */}
      <script src="https://kit.fontawesome.com/2a4ad365af.js" crossOrigin="anonymous" />
    </Helmet>
  )
}
