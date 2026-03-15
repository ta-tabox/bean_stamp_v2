import type { FC } from 'react'
import { memo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Offer } from '@/features/offers/components/pages/Offer'
import { Offers } from '@/features/offers/components/pages/Offers'
import { WantedUsers } from '@/features/offers/components/pages/WantedUsers'
import { RequireForBelongingToRoaster } from '@/router/RequireForBelongingToRoaster'

export const OffersRoutes: FC = memo(() => (
  <Routes>
    {/* ロースター所属を要求 */}
    <Route element={<RequireForBelongingToRoaster />}>
      <Route index element={<Offers />} />
    </Route>
    {/* オファー詳細ページはロースター所属を要求しない */}
    <Route path=":id">
      <Route index element={<Offer />} />
      <Route path="wanted_users" element={<WantedUsers />} />
    </Route>
    <Route path="*" element={<Navigate to="/roasters/home" replace />} />
  </Routes>
))
