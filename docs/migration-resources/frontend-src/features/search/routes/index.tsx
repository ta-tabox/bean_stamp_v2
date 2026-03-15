import type { FC } from 'react'
import { memo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Search } from '@/features/search/components/Pages/Search'
import { SearchedOffers } from '@/features/search/components/Pages/SearchedOffers'
import { SearchedRoasters } from '@/features/search/components/Pages/SearchedRoasters'

export const SearchRoutes: FC = memo(() => (
  <Routes>
    <Route path="/" element={<Search />}>
      <Route path="roasters" element={<SearchedRoasters />} />
      <Route path="offers" element={<SearchedOffers />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
))
