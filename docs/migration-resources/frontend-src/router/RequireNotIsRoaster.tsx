import { Navigate, Outlet } from 'react-router-dom'

import { useCurrentRoaster } from '@/features/roasters'

type Props = {
  redirectPath?: string
}

export const RequireNotIsRoaster = (props: Props) => {
  const { redirectPath = '/roasters/home' } = props

  const { isRoaster } = useCurrentRoaster()

  if (isRoaster) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
