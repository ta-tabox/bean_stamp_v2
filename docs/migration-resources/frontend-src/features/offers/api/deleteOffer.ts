import { BackendApiWithAuth } from '@/lib/axios'
import type { ApplicationMessagesResponse } from '@/types'

type Options = {
  id: string
}

export const deleteOffer = ({ id }: Options) => BackendApiWithAuth.delete<ApplicationMessagesResponse>(`offers/${id}`)
