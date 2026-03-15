import type { RoasterRelationshipResponse } from '@/features/roasterRelationships/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  roasterId: number
}

export const createRoasterRelationship = ({ roasterId }: Options) => {
  const params = {
    roaster_id: roasterId,
  }

  return BackendApiWithAuth.post<RoasterRelationshipResponse>('roaster_relationships', params)
}
