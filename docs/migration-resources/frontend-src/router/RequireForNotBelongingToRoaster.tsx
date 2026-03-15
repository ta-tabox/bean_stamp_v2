import { Navigate, Outlet } from 'react-router-dom'

import { useSignedInUser } from '@/features/auth'

type Props = {
  redirectPath?: string
}

export const RequireForNotBelongingToRoaster = (props: Props) => {
  const { redirectPath = '/users/home' } = props
  const { isBelongingToRoaster } = useSignedInUser()

  if (isBelongingToRoaster) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
