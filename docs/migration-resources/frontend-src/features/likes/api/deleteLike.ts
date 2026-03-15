import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: number
}

export const deleteLike = ({ id }: Options) => BackendApiWithAuth.delete(`likes/${id}`)
