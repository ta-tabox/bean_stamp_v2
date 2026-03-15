import type { FC } from 'react'
import { memo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Want } from '@/features/wants/components/pages/Want'
import { Wants } from '@/features/wants/components/pages/Wants'
import { RequireNotIsRoaster } from '@/router/RequireNotIsRoaster'

export const WantRoutes: FC = memo(() => (
  <Routes>
    {/* ウォントはロースターはアクセスできない */}
    <Route element={<RequireNotIsRoaster />}>
      <Route index element={<Wants />} />
      <Route path=":id">
        <Route index element={<Want />} />
      </Route>
      <Route path="*" element={<Navigate to="/users/home" replace />} />
    </Route>
  </Routes>
))
