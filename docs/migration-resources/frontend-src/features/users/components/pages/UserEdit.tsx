import type { FC } from 'react'
import { useState } from 'react'

import { Link } from '@/components/Elements/Link'
import { NotificationMessage } from '@/components/Elements/Notification'
import { Spinner } from '@/components/Elements/Spinner'
import { FormContainer, FormFooter, FormMain, FormTitle } from '@/components/Form'
import { Head } from '@/components/Head'
import { useSignedInUser } from '@/features/auth'
import { UserThumbnail } from '@/features/users/components/molecules/UserThumbnail'
import { UserUpdateForm } from '@/features/users/components/organisms/UserUpdateForm'
import { useNotification } from '@/hooks/useNotification'

export const UserEdit: FC = () => {
  const { signedInUser } = useSignedInUser()
  const { notifications } = useNotification()

  const [isError, setIsError] = useState(false)

  return (
    <>
      <Head title="ユーザー編集" />
      {!signedInUser && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {signedInUser && (
        <div className="mt-20">
          <FormContainer>
            <div className="flex justify-end -mb-10">
              <UserThumbnail name={signedInUser.name} thumbnailUrl={signedInUser.thumbnailUrl} />
            </div>
            <FormMain>
              <FormTitle>ユーザー情報編集</FormTitle>
              {isError ? <NotificationMessage notifications={notifications} type="error" /> : null}

              <UserUpdateForm user={signedInUser} setIsError={setIsError} />

              <FormFooter>
                <Link to="/users/password">パスワード変更</Link>
                <Link to="/users/cancel">退会する</Link>
              </FormFooter>
            </FormMain>
          </FormContainer>
        </div>
      )}
    </>
  )
}
