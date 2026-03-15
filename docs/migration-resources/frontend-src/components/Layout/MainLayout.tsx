import type { FC } from 'react'
import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { AsideContent } from '@/components/Layout/Aside/AsideContent'
import { BottomNav } from '@/components/Layout/Nav/BottomNav'
import { SideNav } from '@/components/Layout/Nav/SideNav'
import { TopNav } from '@/components/Layout/Nav/TopNav'

export const MainLayout: FC = memo(() => (
  <div className="max-w-screen-2xl lg:mx-auto">
    <div className="flex flex-col lg:flex-row">
      {/* ナビコンテンツ */}
      {/* モバイルトップナビ */}
      <div className="lg:hidden">
        <TopNav />
      </div>
      {/* モバイルボトムナビ */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
      {/* デスクトップサイドナビ */}
      <div className="lg:block hidden">
        <SideNav />
      </div>
      {/* メインコンテンツ */}
      <div className="lg:w-9/12">
        <main className="container mx-auto my-14 lg:my-0">
          <Outlet /> {/* Outletがページ毎に置き換わる */}
        </main>
      </div>
      {/* サイドコンテンツ */}
      <div className="w-3/12 hidden lg:block bg-gray-100">
        <AsideContent />
      </div>
    </div>
  </div>
))
