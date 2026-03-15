import type { FC } from 'react'
import { useEffect, memo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Card } from '@/components/Elements/Card'
import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Pagination } from '@/components/Elements/Pagination'
import { Spinner } from '@/components/Elements/Spinner'
import { Head } from '@/components/Head'
import { OfferDetailCard } from '@/features/offers/components/organisms/OfferDetailCard'
import { useGetOffer } from '@/features/offers/hooks/useGetOffer'
import { useGetUsersWantedToOffer } from '@/features/offers/hooks/useGetUsersWantedToOffer'
import { UserItem } from '@/features/users/components/organisms/UserItem'
import { usePagination } from '@/hooks/usePagination'
import { isNumber } from '@/utils/regexp'

export const WantedUsers: FC = memo(() => {
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentPage, totalPage } = usePagination()
  const { getOffer, offer, loading: offerLoading } = useGetOffer()
  const { usersWantedToOffer: users, getUsersWantedToOffer } = useGetUsersWantedToOffer()

  // urlからオファー情報を取得
  useEffect(() => {
    // urlParams.idが数値かどうか評価
    if (urlParams.id && isNumber(urlParams.id)) {
      getOffer(urlParams.id)
    }
  }, [urlParams.id])

  // urlからオファーをウォントしているユーザー一覧を取得
  useEffect(() => {
    // urlParams.idが数値かどうか評価
    if (urlParams.id && isNumber(urlParams.id)) {
      getUsersWantedToOffer({ id: urlParams.id, page: searchParams.get('page') })
    }
  }, [urlParams.id, searchParams])

  const onClickUser = (id: number) => {
    navigate(`/users/${id}`)
  }

  return (
    <>
      <Head title="ウォントしたユーザー" />
      <ContentHeader>
        <div className="h-full flex justify-start items-end">
          <ContentHeaderTitle title="ウォントしたユーザー" />
        </div>
      </ContentHeader>

      {/* ローディング */}
      {offerLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {!offerLoading && (
        <>
          {/* オファー情報 */}
          {offer && (
            <section className="mt-16">
              <OfferDetailCard offer={offer} />
            </section>
          )}

          {/* ウォントしているユーザー一覧 */}
          {users && (
            <section className="mt-4 mb-20 py-4 text-gray-600">
              {users.length ? (
                <>
                  <Card>
                    <ol>
                      {users.map((user) => (
                        <li key={user.id}>
                          <UserItem user={user} onClick={onClickUser} />
                        </li>
                      ))}
                    </ol>
                  </Card>
                  {currentPage && totalPage && <Pagination currentPage={currentPage} totalPage={totalPage} />}
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <p>ウォントしているユーザーがいません</p>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </>
  )
})
