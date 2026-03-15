import type { FC } from 'react'
import { useEffect, memo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Link } from '@/components/Elements/Link'
import { Pagination } from '@/components/Elements/Pagination'
import { Spinner } from '@/components/Elements/Spinner'
import { Head } from '@/components/Head'
import { OfferContentCard, useGetOffersStats } from '@/features/offers'
import { useCurrentRoaster } from '@/features/roasters/hooks/useCurrentRoaster'
import { useGetOffersByRoaster } from '@/features/roasters/hooks/useGetOffersByRoaster'
import { usePagination } from '@/hooks/usePagination'

export const RoasterHome: FC = memo(() => {
  const { currentRoaster } = useCurrentRoaster()
  const [searchParams] = useSearchParams()
  const { offersByRoaster: offers, getOffersByRoaster, loading } = useGetOffersByRoaster()
  const { getOffersStats } = useGetOffersStats()
  const { currentPage, totalPage } = usePagination()

  useEffect(() => {
    // オファー 一覧を取得
    if (currentRoaster) {
      getOffersByRoaster({ id: currentRoaster.id.toString(), page: searchParams.get('page') })
    }
  }, [currentRoaster, searchParams])

  // ホームアクセス時にAPIを叩く
  useEffect(() => {
    if (currentRoaster) {
      getOffersStats() // 通知用のオファー統計
    }
  }, [])

  return (
    <>
      <Head title="ホーム" />
      <ContentHeader>
        <div className="h-full flex justify-between items-end">
          <ContentHeaderTitle title={`${currentRoaster?.name ?? ''}のホーム`} />
        </div>
      </ContentHeader>

      {/* ローディング */}
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && (
        <>
          {/* オファー 一覧 */}
          {offers && (
            <section className="mt-4">
              {offers.length ? (
                <>
                  <ol>
                    {offers.map((offer) => (
                      <li key={offer.id} className="my-20">
                        <OfferContentCard offer={offer} />
                      </li>
                    ))}
                  </ol>
                  {currentPage && totalPage && <Pagination currentPage={currentPage} totalPage={totalPage} />}
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <Link to="/beans">オファーを作成する</Link>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </>
  )
})
