import { BackendApiWithAuth } from '@/lib/axios'

export const signOutReq = () => BackendApiWithAuth.get('auth/sign_out')
