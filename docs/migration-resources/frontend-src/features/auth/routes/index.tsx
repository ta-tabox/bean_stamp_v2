import type { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { CommonLayout } from '@/components/Layout/CommonLayout'
import { PasswordReset } from '@/features/auth/components/pages/PasswordReset'
import { SignIn } from '@/features/auth/components/pages/SignIn'
import { SignUp } from '@/features/auth/components/pages/SignUp'

export const AuthRoutes: FC = () => (
  <Routes>
    <Route element={<CommonLayout />}>
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="password_reset" element={<PasswordReset />} />
      <Route path="*" element={<Navigate to="signup" />} />
    </Route>
  </Routes>
)
