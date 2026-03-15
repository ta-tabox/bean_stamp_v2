import type { FC } from 'react'
import { memo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Bean } from '@/features/beans/components/pages/Bean'
import { BeanEdit } from '@/features/beans/components/pages/BeanEdit'
import { BeanNew } from '@/features/beans/components/pages/BeanNew'
import { Beans } from '@/features/beans/components/pages/Beans'
import { RequireForBelongingToRoaster } from '@/router/RequireForBelongingToRoaster'

export const BeansRoutes: FC = memo(() => (
  <Routes>
    {/* ロースター所属を要求 */}
    <Route element={<RequireForBelongingToRoaster />}>
      <Route index element={<Beans />} />
      <Route path="new" element={<BeanNew />} />
      <Route path=":id">
        <Route index element={<Bean />} />
        <Route path="edit" element={<BeanEdit />} />
      </Route>
      <Route path="*" element={<Navigate to="/roasters/home" replace />} />
    </Route>
  </Routes>
))
