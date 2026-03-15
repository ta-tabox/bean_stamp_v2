import type { RoasterRelationshipResponse } from '@/features/roasterRelationships/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
}

export const deleteRoasterRelationship = ({ id }: Options) =>
  BackendApiWithAuth.delete<RoasterRelationshipResponse>(`roaster_relationships/${id}`)
