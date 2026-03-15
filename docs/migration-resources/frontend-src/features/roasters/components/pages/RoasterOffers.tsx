import type { FC } from 'react'
import { useEffect, memo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { Pagination } from '@/components/Elements/Pagination'
import { Spinner } from '@/components/Elements/Spinner'
import { OfferContentCard } from '@/features/offers'
import { useGetOffersByRoaster } from '@/features/roasters/hooks/useGetOffersByRoaster'
import { usePagination } from '@/hooks/usePagination'
import { isNumber } from '@/utils/regexp'

export const RoasterOffers: FC = memo(() => {
  const urlParams = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { offersByRoaster: offers, getOffersByRoaster, loading } = useGetOffersByRoaster()
  const { currentPage, totalPage } = usePagination()

  useEffect(() => {
    const fetchData = (id: string, page: string | null) => {
      // urlからユーザーがフォローしているロースターを取得
      getOffersByRoaster({ id, page })
    }

    // urlParams.idが数値かどうか評価
    if (urlParams.id && isNumber(urlParams.id)) {
      fetchData(urlParams.id, searchParams.get('page'))
    }
  }, [urlParams.id, searchParams])

  return (
    <>
      {/* ローディング */}
      {loading && (
        <div className="flex justify-center mt-16">
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
                      <li key={offer.id} className="mt-16">
                        <OfferContentCard offer={offer} />
                      </li>
                    ))}
                  </ol>
                  {currentPage && totalPage && <Pagination currentPage={currentPage} totalPage={totalPage} />}
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <p>オファーがありません</p>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </>
  )
})
