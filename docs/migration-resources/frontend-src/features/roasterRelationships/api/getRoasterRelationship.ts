import type { GetRoasterRelationshipResponse } from '@/features/roasterRelationships/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  roasterId: string
}

export const getRoasterRelationship = ({ roasterId }: Options) =>
  BackendApiWithAuth.get<GetRoasterRelationshipResponse>(`roaster_relationships/`, {
    params: {
      roaster_id: roasterId,
    },
  })
