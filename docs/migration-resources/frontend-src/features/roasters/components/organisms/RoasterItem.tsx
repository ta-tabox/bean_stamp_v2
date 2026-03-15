import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import defaultRoasterImage from '@/features/roasters/assets/defaultRoaster.png'
import type { Roaster } from '@/features/roasters/types'
import { translatePrefectureCodeToName } from '@/utils/prefecture'

type Props = {
  roaster: Roaster
}

export const RoasterItem: FC<Props> = (props) => {
  const { roaster } = props
  const { id, name, prefectureCode, address, describe, imageUrl } = roaster

  const navigate = useNavigate()

  const area = translatePrefectureCodeToName({ prefectureCode })

  const onClickRoaster = () => {
    navigate(`/roasters/${id}`)
  }

  return (
    <button type="button" className="block w-full" onClick={onClickRoaster}>
      <div
        id={`roaster-${id}`}
        className="flex flex-col items-center justify-between p-4 duration-300 border-b border-gray-100 sm:border-0 sm:flex-row sm:py-4 px-4 sm:px-8 hover:bg-gray-100"
      >
        <div className="w-full flex items-center text-center flex-col sm:flex-row sm:text-left">
          <div className="mb-2.5 sm:mb-0 sm:mr-4 flex-none">
            <img
              className="object-cover w-20 h-20 border-2 border-indigo-500 rounded-full"
              src={imageUrl ?? defaultRoasterImage}
              alt={`${name}の画像`}
            />
          </div>
          <div className="w-full flex flex-col mb-4 sm:mb-0 sm:mr-4 overflow-hidden">
            <p className="font-medium truncate">{name}</p>
            <p className="truncate">{area + address}</p>
            <p className="truncate text-gray-500">{describe}</p>
          </div>
        </div>
      </div>
    </button>
  )
}
