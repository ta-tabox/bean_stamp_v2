import type { FC } from 'react'
import { memo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Likes } from '@/features/likes/components/pages/Likes'
import { RequireNotIsRoaster } from '@/router/RequireNotIsRoaster'

export const LikeRoutes: FC = memo(() => (
  <Routes>
    {/* お気に入りはロースターはアクセスできない */}
    <Route element={<RequireNotIsRoaster />}>
      <Route index element={<Likes />} />
      <Route path="*" element={<Navigate to="/users/home" replace />} />
    </Route>
  </Routes>
))
