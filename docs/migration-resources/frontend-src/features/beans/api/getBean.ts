import type { Bean } from '@/features/beans/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Options = {
  id: string
}

export const getBean = ({ id }: Options) => BackendApiWithAuth.get<Bean>(`/beans/${id}`)
