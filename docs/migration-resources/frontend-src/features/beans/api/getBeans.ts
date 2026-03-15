import type { Bean } from '@/features/beans/types'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
}

export const getBeans = ({ page }: Props) => BackendApiWithAuth.get<Array<Bean>>(`/beans?page=${page ?? 1}`)
