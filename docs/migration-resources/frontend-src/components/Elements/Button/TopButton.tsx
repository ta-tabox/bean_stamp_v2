import type { FC } from 'react'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSignedInUser } from '@/features/auth'
import { useCurrentRoaster } from '@/features/roasters'

export const TopButton: FC = memo(() => {
  const navigate = useNavigate()
  const { isSignedIn } = useSignedInUser()
  const { isRoaster } = useCurrentRoaster()

  const onClickHome = () => {
    if (isSignedIn) {
      if (isRoaster) {
        navigate('/roasters/home')
      } else {
        navigate('/users/home')
      }
    } else {
      navigate('/')
    }
  }
  return (
    <button type="button" onClick={onClickHome}>
      <h1 className="logo-font tracking-tight text-xl lg:text-2xl h-full px-2 text-teal-900">Bean Stamp</h1>
    </button>
  )
})
