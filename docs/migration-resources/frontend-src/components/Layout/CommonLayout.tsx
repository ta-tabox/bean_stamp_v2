import type { FC } from 'react'
import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/Layout/Nav/Header'

export const CommonLayout: FC = memo(() => (
  <>
    <Header />
    <Outlet /> {/* Outletがページ毎に置き換わる */}
  </>
))
