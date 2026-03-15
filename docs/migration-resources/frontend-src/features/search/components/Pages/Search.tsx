import type { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Head } from '@/components/Head'
import { SearchFormTab } from '@/features/search/components/molecules/SearchFormTab'

export const Search: FC = () => (
  <>
    <Head title="探す" />
    <ContentHeader>
      <div className="h-full flex justify-start items-end">
        <ContentHeaderTitle title="探す" />
      </div>
    </ContentHeader>

    <section>
      <div className="">
        <SearchFormTab />
      </div>
      <div className="pt-8">
        <Outlet />
      </div>
    </section>
  </>
)
