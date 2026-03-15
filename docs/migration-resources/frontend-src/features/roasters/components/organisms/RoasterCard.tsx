import type { FC } from 'react'
import { useEffect, useState, memo } from 'react'
import { Link as ReactLink } from 'react-router-dom'

import { Card, CardContainer } from '@/components/Elements/Card'
import { Link } from '@/components/Elements/Link'
import { FollowUnFollowButton, getRoasterRelationship } from '@/features/roasterRelationships'
import { LinkToRoasterFollower } from '@/features/roasters/components/molecules/LinkToRoasterFollower'
import { RoasterImage } from '@/features/roasters/components/molecules/RoasterImage'
import { useCurrentRoaster } from '@/features/roasters/hooks/useCurrentRoaster'
import type { Roaster } from '@/features/roasters/types'
import { fullAddress } from '@/features/roasters/utils/fullAddress'
import { useMessage } from '@/hooks/useMessage'

type Props = {
  roaster: Roaster
}

export const RoasterCard: FC<Props> = memo((props) => {
  const { roaster } = props
  const { currentRoaster } = useCurrentRoaster()
  const { showMessage } = useMessage()

  const [roasterRelationshipId, setRoasterRelationshipId] = useState<number | null>(null)
  const [followersCount, setFollowersCount] = useState<number>(roaster.followersCount)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getRoasterRelationship({ roasterId: roaster.id.toString() })
      .then((response) => {
        setRoasterRelationshipId(response.data.roasterRelationshipId)
      })
      .catch(() => {
        showMessage({ message: 'Follow情報の取得に失敗', type: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <Card>
      <CardContainer>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 lg:mx-4 text-center lg:text-left">
            <ReactLink to={`/roasters/${roaster.id}`}>
              <div className="text-2xl font-medium text-gray-800">{roaster.name}</div>
            </ReactLink>
            {roaster.id === currentRoaster?.id ? (
              <div className="mt-2 lg:mt-0 lg:text-right lg:mr-4">
                <Link to="/roasters/edit">編集</Link>
              </div>
            ) : null}

            <div className="mt-2 flex items-baseline justify-around lg:justify-start">
              <LinkToRoasterFollower roasterId={roaster.id} followersCount={followersCount} />

              {/* フォローボタン 自身のロースターの場合は非表示 */}
              {roaster.id !== currentRoaster?.id &&
                (loading ? null : (
                  <FollowUnFollowButton
                    roasterId={roaster.id}
                    roasterRelationshipId={roasterRelationshipId}
                    setRoasterRelationshipId={setRoasterRelationshipId}
                    followersCount={followersCount}
                    setFollowersCount={setFollowersCount}
                  />
                ))}
            </div>

            <div className="mt-4 text-gray-500 lg:max-w-md">
              <div>住所: {fullAddress({ roaster })}</div>
              <div>TEL: {roaster.phoneNumber}</div>

              <p className="mt-4">{roaster.describe}</p>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2">
            <div className="flex items-center justify-center lg:justify-end">
              <div className="max-w-lg">
                <RoasterImage roaster={roaster} />
              </div>
            </div>
          </div>
        </div>
      </CardContainer>
    </Card>
  )
})
