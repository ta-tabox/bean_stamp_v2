import type { FC } from 'react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { LoadingButton } from '@/components/Elements/Button'
import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Link } from '@/components/Elements/Link'
import { Pagination } from '@/components/Elements/Pagination'
import { Head } from '@/components/Head'
import { useGetLikes } from '@/features/likes/hooks/useGetLikes'
import { OfferContentCard, OfferStatusFilterForm } from '@/features/offers'
import { usePagination } from '@/hooks/usePagination'

export const Likes: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { likes, getLikes, loading } = useGetLikes()
  const { currentPage, totalPage } = usePagination()

  useEffect(() => {
    // お気に入り 一覧を取得
    void getLikes({ page: searchParams.get('page'), status: searchParams.get('status') })
  }, [searchParams])

  const onClickReload = () => {
    void getLikes({ page: null })
    setSearchParams({})
  }

  return (
    <>
      <Head title="お気に入り一覧" />
      <ContentHeader>
        <div className="h-full flex flex-col sm:flex-row justify-between sm:items-end">
          <ContentHeaderTitle title="お気に入り一覧" />
          <div className="text-left ml-auto sm:ml-0">
            <OfferStatusFilterForm />
          </div>
        </div>
      </ContentHeader>

      {/* お気に入り更新ボタン */}
      <LoadingButton onClick={onClickReload} loading={loading} />

      {!loading && (
        <>
          {/* お気に入り一覧 */}
          {likes && (
            <section className="mt-4">
              {likes.length ? (
                <>
                  <ol>
                    {likes.map((like) => (
                      <li key={like.id} className="mt-20">
                        <OfferContentCard offer={like.offer} />
                      </li>
                    ))}
                  </ol>
                  {currentPage && totalPage && <Pagination currentPage={currentPage} totalPage={totalPage} />}
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <p>お気に入りがありません</p>
                  <Link to="/search/offers">オファーを探す</Link>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </>
  )
}
