import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
}

export const deleteRoaster = ({ id }: Options) => BackendApiWithAuth.delete(`roasters/${id}`)
