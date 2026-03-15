import type { FC } from 'react'
import { memo } from 'react'
import { Link as ReactLink } from 'react-router-dom'

import { Card, CardContainer } from '@/components/Elements/Card'
import { Link } from '@/components/Elements/Link'
import { useSignedInUser } from '@/features/auth/hooks/useSignedInUser'
import { UserImage } from '@/features/users/components/molecules/UserImage'
import type { User } from '@/features/users/types'
import { translatePrefectureCodeToName } from '@/utils/prefecture'

type Props = {
  user: User
}

export const UserCard: FC<Props> = memo((props) => {
  const { user } = props
  const { signedInUser } = useSignedInUser()

  return (
    <Card>
      <CardContainer>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 lg:mx-4 text-center lg:text-left">
            <ReactLink to={`/users/${user.id}`}>
              <div className="text-2xl font-medium text-gray-800 inline-block">{user.name}</div>
            </ReactLink>
            {user.id === signedInUser?.id ? (
              <div className="mt-2 lg:mt-0 lg:text-right lg:mr-4">
                <Link to="/users/edit">編集</Link>
              </div>
            ) : null}

            <div className="mt-4 text-gray-500 lg:max-w-md">
              <div>@ {translatePrefectureCodeToName({ prefectureCode: user.prefectureCode })}</div>
              <p className="mt-4">{user.describe}</p>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2">
            <div className="flex items-center justify-center lg:justify-end">
              <div className="max-w-lg">
                <UserImage user={user} />
              </div>
            </div>
          </div>
        </div>
      </CardContainer>
    </Card>
  )
})
