import type { FC } from 'react'
import { Link } from 'react-router-dom'

import type { Offer } from '@/features/offers/types'

type Props = {
  offer: Offer
}

// NOTE コンポーネント分割した方がいい？
export const RecommendedOfferItem: FC<Props> = (props) => {
  const { offer } = props
  const { id, roaster, bean } = offer
  const { country, process, roastLevel, taste } = bean
  return (
    <article>
      <Link to={`/offers/${id}`}>
        <div className="w-52 bg-white shadow rounded border border-transparent hover:border-indigo-500 cursor-pointer">
          <div className="pt-4 px-4 pb-1 border-t border-gray-200 flex flex-col space-y-1">
            <h1 className="text-gray-600 font-medium text-sm">{roaster.name}</h1>
            <div className="pb-1">
              <div className="flex items-center relative">
                <i className="fa-solid fa-earth-asia fa-xs mr-1 text-gray-400 absolute top-2 left-1" />
                <p className="pl-8 text-gray-400 font-light text-xs">{country.name}</p>
              </div>
              <div className="flex items-center relative">
                <i className="fa-solid fa-industry fa-xs mr-1 text-gray-400 absolute top-2 left-1" />
                <p className="pl-8 text-gray-400 font-light text-xs">{process}</p>
              </div>
              <div className="flex items-center relative">
                <i className="fa-solid fa-fire-flame-curved fa-xs mr-1 text-gray-400 absolute top-2 left-1" />
                <p className="pl-8 text-gray-400 font-light text-xs">{roastLevel.name}</p>
              </div>
            </div>
            {taste.names && (
              <div className="flex flex-wrap justify-start">
                {taste.names.map((name) => (
                  <div
                    key={name}
                    className="rounded-full py-1 px-1 mb-1 border bg-white border-gray-200 text-center font-light text-gray-400 text-xs capitalize"
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <img
            src={bean.imageUrls[0]}
            alt={`${bean.name}の画像`}
            className="w-full h-32 object-cover object-center rounded-b"
          />
        </div>
      </Link>
    </article>
  )
}
