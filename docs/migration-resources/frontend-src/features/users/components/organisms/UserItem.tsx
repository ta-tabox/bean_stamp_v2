import type { FC } from 'react'
import { memo } from 'react'

import defaultUserImage from '@/features/users/assets/defaultUser.png'
import type { User } from '@/features/users/types'
import { translatePrefectureCodeToName } from '@/utils/prefecture'

type Props = {
  user: User
  onClick: (id: number) => void
}

export const UserItem: FC<Props> = memo((props) => {
  const { user, onClick } = props
  const { id, name, prefectureCode, describe, imageUrl } = user
  const area = translatePrefectureCodeToName({ prefectureCode })

  return (
    <button type="button" className="block w-full" onClick={() => onClick(id)}>
      <div
        id={`user-${id}`}
        className="flex flex-col items-center justify-between p-4 duration-300 border-b border-gray-100 sm:border-0 sm:flex-row sm:py-4 px-4 sm:px-8 hover:bg-gray-100"
      >
        <div className="w-full flex items-center text-center flex-col sm:flex-row sm:text-left">
          <div className="mb-2.5 sm:mb-0 sm:mr-4 flex-none">
            <img
              className="object-cover w-20 h-20 border-2 border-indigo-500 rounded-full"
              src={imageUrl ?? defaultUserImage}
              alt={`${name}の画像`}
            />
          </div>
          <div className="w-full flex flex-col mb-4 sm:mb-0 sm:mr-4 overflow-hidden">
            <p className="font-medium truncate">{name}</p>
            <p className="truncate">@ {area}</p>
            <p className="truncate text-gray-500">{describe}</p>
          </div>
        </div>
      </div>
    </button>
  )
})
