import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
}

export const deleteBean = ({ id }: Options) => BackendApiWithAuth.delete(`beans/${id}`)
