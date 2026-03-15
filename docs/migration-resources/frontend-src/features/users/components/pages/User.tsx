import type { FC } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { ContentHeader, ContentHeaderTitle } from '@/components/Elements/Content'
import { Spinner } from '@/components/Elements/Spinner'
import { UserCard } from '@/features/users/components/organisms/UserCard'
import { useGetUser } from '@/features/users/hooks/useGetUser'
import { isNumber } from '@/utils/regexp'

export const User: FC = () => {
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, getUser, loading } = useGetUser()

  useEffect(() => {
    // urlParams.idが数値かどうか評価
    if (urlParams.id && isNumber(urlParams.id)) {
      getUser(urlParams.id)
    } else {
      navigate('/')
    }
  }, [urlParams.id])

  return (
    <>
      <ContentHeader>
        <div className="h-full flex justify-start items-end">
          <ContentHeaderTitle title="ユーザー詳細" />
        </div>
      </ContentHeader>

      <section>
        {loading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        {!loading && user && <UserCard user={user} />}
      </section>
    </>
  )
}
