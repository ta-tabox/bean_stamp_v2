import type { FC } from 'react'
import { memo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Roaster } from '@/features/roasters/components/pages/Roaster'
import { RoasterCancel } from '@/features/roasters/components/pages/RoasterCancel'
import { RoasterEdit } from '@/features/roasters/components/pages/RoasterEdit'
import { RoasterFollower } from '@/features/roasters/components/pages/RoasterFollower'
import { RoasterHome } from '@/features/roasters/components/pages/RoasterHome'
import { RoasterNew } from '@/features/roasters/components/pages/RoasterNew'
import { RoasterOffers } from '@/features/roasters/components/pages/RoasterOffers'
import { RequireForBelongingToRoaster } from '@/router/RequireForBelongingToRoaster'
import { RequireForNotBelongingToRoaster } from '@/router/RequireForNotBelongingToRoaster'

export const RoastersRoutes: FC = memo(() => (
  <Routes>
    {/* ロースター未所属を要求 */}
    <Route element={<RequireForNotBelongingToRoaster redirectPath="/roasters/home" />}>
      <Route path="new" element={<RoasterNew />} />
    </Route>
    {/* ロースター所属を要求 */}
    <Route element={<RequireForBelongingToRoaster />}>
      <Route index element={<RoasterHome />} />
      <Route path="home" element={<RoasterHome />} />
      <Route path="edit" element={<RoasterEdit />} />
      <Route path="cancel" element={<RoasterCancel />} />
    </Route>
    {/* ロースター所属未所属を問わない */}
    <Route path=":id" element={<Roaster />}>
      <Route index element={<RoasterOffers />} />
      <Route path="follower" element={<RoasterFollower />} />
    </Route>
    <Route path="*" element={<Navigate to="/roasters/home" replace />} />
  </Routes>
))
