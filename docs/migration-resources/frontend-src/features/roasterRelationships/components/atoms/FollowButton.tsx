import type { FC } from 'react'
import { memo } from 'react'

type Props = {
  onClick: () => void
}

export const FollowButton: FC<Props> = memo((props) => {
  const { onClick } = props

  return (
    <button
      type="button"
      onClick={onClick}
      className="btn bg-indigo-500 border-indigo-600 text-white hover:bg-indigo-600 active:bg-indigo-700 w-24"
    >
      フォロー
    </button>
  )
})
