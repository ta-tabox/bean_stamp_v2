import type { FC } from 'react'
import { useEffect, memo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { Card } from '@/components/Elements/Card'
import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Link } from '@/components/Elements/Link'
import { Pagination } from '@/components/Elements/Pagination'
import { Spinner } from '@/components/Elements/Spinner'
import { Head } from '@/components/Head'
import { RoasterItem } from '@/features/roasters/components/organisms/RoasterItem'
import { UserCard } from '@/features/users/components/organisms/UserCard'
import { useGetRoastersFollowedByUser } from '@/features/users/hooks/useGetRoastersFollowedByUser'
import { useGetUser } from '@/features/users/hooks/useGetUser'
import { usePagination } from '@/hooks/usePagination'
import { isNumber } from '@/utils/regexp'

export const UserFollowing: FC = memo(() => {
  const urlParams = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { user, getUser, loading: userLoading } = useGetUser()
  const { roasters, getRoastersFollowedByUser } = useGetRoastersFollowedByUser()
  const { currentPage, totalPage } = usePagination()

  useEffect(() => {
    // urlParams.idが数値かどうか評価
    if (urlParams.id && isNumber(urlParams.id)) {
      getUser(urlParams.id)
    }
  }, [urlParams.id])

  useEffect(() => {
    if (urlParams.id) {
      // urlからユーザーがフォローしているロースターを取得
      getRoastersFollowedByUser({ id: urlParams.id, page: searchParams.get('page') })
    }
  }, [urlParams.id, searchParams])

  return (
    <>
      <Head title="フォロー" />
      <ContentHeader>
        <div className="h-full flex justify-start items-end">
          <ContentHeaderTitle title="フォロー" />
        </div>
      </ContentHeader>

      {/* ローディング */}
      {userLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {!userLoading && (
        <>
          {/* ユーザー情報 */}
          {user && <UserCard user={user} />}
        </>
      )}

      {/* フォローしているロースター一覧 */}
      {roasters && (
        <section className="mt-4 mb-20 py-4 text-gray-600">
          {roasters.length ? (
            <>
              <Card>
                <ol>
                  {roasters.map((roaster) => (
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
              <p>フォローしているロースターがいません</p>
              <div className="mt-4 w-1/2 sm:w-1/3 mx-auto">
                <Link to="/search/roasters">ロースターを探す</Link>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  )
})
