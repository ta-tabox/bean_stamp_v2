import type { Roaster } from '@/features/roasters'
import { BackendApiWithAuth } from '@/lib/axios'

type Props = {
  page: string | null
  query: string
}

export const getRoastersWithSearch = ({ page, query }: Props) =>
  BackendApiWithAuth.get<Array<Roaster>>(`/search/roasters?${query}&page=${page ?? 1}`)
