import type { Dispatch, FC } from 'react'
import React, { useCallback } from 'react'

import { createRoasterRelationship } from '@/features/roasterRelationships/api/createRoasterRelationship'
import { deleteRoasterRelationship } from '@/features/roasterRelationships/api/deleteRoasterRelationship'
import { FollowButton } from '@/features/roasterRelationships/components/atoms/FollowButton'
import { UnFollowButton } from '@/features/roasterRelationships/components/atoms/UnFollowButton'
import { useGetUsersFollowingToRoaster } from '@/features/roasters'
import { useMessage } from '@/hooks/useMessage'

type Props = {
  roasterId: number
  roasterRelationshipId: number | null
  setRoasterRelationshipId: Dispatch<React.SetStateAction<number | null>>
  followersCount: number
  setFollowersCount: Dispatch<React.SetStateAction<number>>
}

export const FollowUnFollowButton: FC<Props> = (props) => {
  const { roasterId, roasterRelationshipId, setRoasterRelationshipId, setFollowersCount, followersCount } = props
  const { showMessage } = useMessage()
  const { getUsersFollowingToRoaster } = useGetUsersFollowingToRoaster()

  const onClickFollow = () => {
    createRoasterRelationship({ roasterId })
      .then((response) => {
        setRoasterRelationshipId(response.data.roasterRelationship.id) // deleteリクエストで使用するurl: /roaster_relationships/:idに使用
        setFollowersCount(followersCount + 1) // RoasterCardで使用するfollower数
        getUsersFollowingToRoaster({ id: roasterId.toString(), page: null }) // API:RoasterのFollower情報を更新 RoasterFollowerコンポーネントで表示
      })
      .catch(() => {
        showMessage({ message: 'フォローに失敗しました', type: 'error' })
      })
  }

  const onClickUnFollow = useCallback(() => {
    if (roasterRelationshipId) {
      deleteRoasterRelationship({ id: roasterRelationshipId.toString() })
        .then(() => {
          setRoasterRelationshipId(null) // roaster_relationship削除に伴うリセット
          setFollowersCount(followersCount - 1) // RoasterCardで使用するfollower数
          getUsersFollowingToRoaster({ id: roasterId.toString(), page: null }) // API:RoasterのFollower情報を更新 RoasterFollowerコンポーネントで表示
        })
        .catch(() => {
          showMessage({ message: 'フォロー削除に失敗しました', type: 'error' })
        })
    }
  }, [roasterRelationshipId, followersCount])

  return roasterRelationshipId ? <UnFollowButton onClick={onClickUnFollow} /> : <FollowButton onClick={onClickFollow} />
}
