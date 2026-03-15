import type { FC } from 'react'
import { memo } from 'react'

type Props = {
  onClick: () => void
}

export const UnFollowButton: FC<Props> = memo((props) => {
  const { onClick } = props

  return (
    <button
      type="button"
      onClick={onClick}
      className="btn bg-white border-gray-200 text-gray-600 hover:bg-gray-100 active:bg-gray-200 w-24"
    >
      フォロー中
    </button>
  )
})
