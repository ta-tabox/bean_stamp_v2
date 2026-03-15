import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: number
}

export const deleteWant = ({ id }: Options) => BackendApiWithAuth.delete(`wants/${id}`)
