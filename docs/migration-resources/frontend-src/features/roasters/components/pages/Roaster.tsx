import type { FC } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'

import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Head } from '@/components/Head'
import { RoasterCard } from '@/features/roasters/components/organisms/RoasterCard'
import { useGetRoaster } from '@/features/roasters/hooks/useGetRoaster'
import { isNumber } from '@/utils/regexp'

export const Roaster: FC = () => {
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { roaster, getRoaster } = useGetRoaster()

  useEffect(() => {
    if (urlParams.id && isNumber(urlParams.id)) {
      getRoaster(urlParams.id)
    } else {
      navigate('/roasters/home')
    }
  }, [urlParams.id])

  return (
    <>
      <Head title="ロースター" />
      <ContentHeader>
        <div className="h-full flex justify-start items-end">
          <ContentHeaderTitle title="ロースター" />
        </div>
      </ContentHeader>

      <section>
        {roaster && <RoasterCard roaster={roaster} />}
        {/* index-> Offer一覧, follower -> フォロワー一覧 */}
        <Outlet />
      </section>
    </>
  )
}
