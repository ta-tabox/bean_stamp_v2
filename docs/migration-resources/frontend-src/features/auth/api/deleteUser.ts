import { BackendApiWithAuth } from '@/lib/axios'

export const deleteUserReq = () => BackendApiWithAuth.delete('auth')
