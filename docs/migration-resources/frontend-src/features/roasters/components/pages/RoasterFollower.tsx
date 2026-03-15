import type { FC } from 'react'
import { useEffect, memo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Card } from '@/components/Elements/Card'
import { ContentSubTitle } from '@/components/Elements/Content'
import { Pagination } from '@/components/Elements/Pagination'
import { Head } from '@/components/Head'
import { useGetUsersFollowingToRoaster } from '@/features/roasters/hooks/useGetUsersFollowingToRoaster'
import { UserItem } from '@/features/users/components/organisms/UserItem'
import { usePagination } from '@/hooks/usePagination'
import { isNumber } from '@/utils/regexp'

export const RoasterFollower: FC = memo(() => {
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentPage, totalPage } = usePagination()
  const { usersFollowingToRoaster, getUsersFollowingToRoaster } = useGetUsersFollowingToRoaster()

  useEffect(() => {
    // urlParams.idが数値かどうか評価
    if (urlParams.id && isNumber(urlParams.id)) {
      // urlからユーザーがフォローしているロースターを取得
      getUsersFollowingToRoaster({ id: urlParams.id, page: searchParams.get('page') })
    }
  }, [urlParams.id, searchParams])

  const onClickUser = (id: number) => {
    navigate(`/users/${id}`)
  }

  return (
    <>
      <Head title="フォロワー" />
      <ContentSubTitle title="フォロワー" />

      {/* フォローされているユーザー一覧 */}
      {usersFollowingToRoaster && (
        <section className="mb-20 py-4 text-gray-600">
          {usersFollowingToRoaster.length ? (
            <>
              <Card>
                <ol>
                  {usersFollowingToRoaster.map((user) => (
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
              <p>フォローしているユーザーがいません</p>
            </div>
          )}
        </section>
      )}
    </>
  )
})
