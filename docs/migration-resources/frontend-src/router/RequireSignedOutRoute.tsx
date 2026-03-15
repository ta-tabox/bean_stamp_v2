import { Navigate, Outlet } from 'react-router-dom'

import { useSignedInUser } from '@/features/auth'

type Props = {
  redirectPath?: string
}

export const RequireSignedOutRoute = (props: Props) => {
  const { redirectPath = '/users/home' } = props
  const { isSignedIn } = useSignedInUser()

  if (isSignedIn) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
