import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Card } from '@/components/Elements/Card'
import { Pagination } from '@/components/Elements/Pagination'
import { Spinner } from '@/components/Elements/Spinner'
import { Head } from '@/components/Head'
import type { Roaster } from '@/features/roasters'
import { RoasterItem } from '@/features/roasters'
import { getRoastersWithSearch } from '@/features/search/api/getRoastersWithSearch'
import { useMessage } from '@/hooks/useMessage'
import { usePagination } from '@/hooks/usePagination'

export const SearchedRoasters: FC = () => {
  const { currentPage, totalPage, setPagination } = usePagination()
  const [searchedRoasters, setSearchedRoasters] = useState<Array<Roaster>>([])

  const [searchParams] = useSearchParams()
  const { showMessage } = useMessage()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getRoastersWithSearch({ page: searchParams.get('page'), query: searchParams.toString() })
      .then((response) => {
        if (response.data.length === 0) {
          showMessage({ message: 'ロースターが見つかりませんでした', type: 'error' })
          setSearchedRoasters([])
        } else {
          setSearchedRoasters(response.data)
        }
        setPagination({ headers: response.headers })
      })
      .catch(() => {
        showMessage({ message: 'ロースターが見つかりません', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [searchParams])

  return (
    <>
      <Head title="ロースターを探す" />

      {/* ローディング */}
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {/* ロースター検索結果 */}
      {!loading && searchedRoasters && (
        <section className="text-gray-600">
          {searchedRoasters.length ? (
            <>
              <Card>
                <ol>
                  {searchedRoasters.map((roaster) => (
                    <li key={roaster.id}>
                      <RoasterItem roaster={roaster} />
                    </li>
                  ))}
                </ol>
              </Card>
              {currentPage && totalPage && <Pagination currentPage={currentPage} totalPage={totalPage} />}
            </>
          ) : (
            <div className="text-center text-gray-400">
              <p>ロースターが見つかりませんでした</p>
              <p>検索条件を変えてお試しください</p>
            </div>
          )}
        </section>
      )}
    </>
  )
}
