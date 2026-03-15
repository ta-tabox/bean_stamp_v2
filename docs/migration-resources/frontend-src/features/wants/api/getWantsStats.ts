import type { WantsStats } from '@/features/wants/types'
import { BackendApiWithAuth } from '@/lib/axios'

export const getWantsStats = () => BackendApiWithAuth.get<WantsStats>('wants/stats')
