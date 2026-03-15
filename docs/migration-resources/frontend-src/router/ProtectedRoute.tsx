import { Navigate, Outlet } from 'react-router-dom'

import { useSignedInUser } from '@/features/auth/hooks/useSignedInUser'

type Props = {
  redirectPath?: string
}

export const ProtectedRoute = (props: Props) => {
  const { redirectPath = '/auth/signin' } = props
  const { isSignedIn } = useSignedInUser()
  if (!isSignedIn) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
