export type { WantApiResponse, WantsStatsApiResponse } from "@/server/wants/dto"
export {
  createWant,
  deleteWant,
  getWantForUser,
  getWantsStatsForUser,
  listWantsForUser,
  markWantAsReceived,
  parseWantCreateInput,
  parseWantRateInput,
  rateWant,
} from "@/server/wants/service"
export { revalidateWantPaths } from "@/server/wants/revalidation"
