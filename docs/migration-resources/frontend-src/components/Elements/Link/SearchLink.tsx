import type { FC } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  type: 'roaster' | 'offer'
}

export const SearchLink: FC<Props> = (props) => {
  const { type } = props

  let title = ''
  let link = ''

  switch (type) {
    case 'roaster':
      title = 'ロースター'
      link = '/search/roasters'
      break
    case 'offer':
      title = 'オファー'
      link = '/search/offers'
      break
    default:
  }

  return (
    <Link to={link}>
      <div className="py-2 px-4 bg-white text-gray-600 text-center rounded-full border border-gray-200 hover:bg-gray-50 active:bg-gray-200 flex items-center">
        <svg className="w-6 h-6">
          <use xlinkHref="#search" />
        </svg>
        <p className="ml-2 pl-2 text-xs md:text-sm border-l border-gray-100">{`${title}を検索`}</p>
      </div>
    </Link>
  )
}
