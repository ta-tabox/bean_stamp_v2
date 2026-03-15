import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Pagination } from '@/components/Elements/Pagination'
import { Spinner } from '@/components/Elements/Spinner'
import { Head } from '@/components/Head'
import type { Offer } from '@/features/offers'
import { OfferContentCard } from '@/features/offers'
import { getOffersWithSearch } from '@/features/search/api/getOffersWithSearch'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const SearchedOffers: FC = () => {
  const { currentPage, totalPage, setPagination } = usePagination()
  const [searchedOffers, setSearchedOffers] = useState<Array<Offer>>([])

  const [searchParams] = useSearchParams()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getOffersWithSearch({ page: searchParams.get('page'), query: searchParams.toString() })
      .then((response) => {
        if (response.data.length === 0) {
          showMessage({ message: 'オファーが見つかりませんでした', type: 'error' })
          setSearchedOffers([])
        } else {
          setSearchedOffers(response.data)
        }
        setPagination({ headers: response.headers })
      })
      .catch(() => {
        showMessage({ message: 'オファーが見つかりません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [searchParams])

  return (
    <>
      <Head title="オファーを探す" />

      {/* ローディング */}
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {/* オファー検索結果 */}
      {!loading && searchedOffers && (
        <section className="text-gray-600">
          {searchedOffers.length ? (
            <>
              <ol>
                {searchedOffers.map((offer) => (
                  <li key={offer.id} className="mt-20">
                    <OfferContentCard offer={offer} />
                  </li>
                ))}
              </ol>
              {currentPage && totalPage && <Pagination currentPage={currentPage} totalPage={totalPage} />}
            </>
          ) : (
            <div className="text-center text-gray-400">
              <p>オファーが見つかりませんでした</p>
              <p>検索条件を変えてお試しください</p>
            </div>
          )}
        </section>
      )}
    </>
  )
}
