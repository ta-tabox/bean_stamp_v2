type UserApiInput = {
  describe: string | null
  email: string
  guest: boolean
  id: bigint
  image: string | null
  name: string
  prefectureCode: string
  roasterId: bigint | null
}

type RoasterApiInput = {
  address: string
  describe: string | null
  guest: boolean
  id: bigint
  image: string | null
  name: string
  phoneNumber: string
  prefectureCode: string
}

type RoasterRelationshipSummaryInput = {
  followersCount: number
  followingRoastersCount: number
  relationshipId: bigint | null
  roasterId: bigint
  roasterName: string
  userId: bigint
  userName: string
}

export type UserApiResponse = {
  describe: string | null
  email: string
  guest: boolean
  id: number
  image_url: string | null
  name: string
  prefecture_code: string
  roaster_id: number | null
  thumbnail_url: string | null
}

export type RoasterApiResponse = {
  address: string
  describe: string | null
  followers_count?: number
  guest: boolean
  id: number
  image_url: string | null
  name: string
  phone_number: string
  prefecture_code: string
  roaster_relationship_id?: number | null
  thumbnail_url: string | null
}

export type RoasterRelationshipStatusApiResponse = {
  is_followed_by_signed_in_user: boolean
  roaster_relationship_id: number | null
}

export type RoasterRelationshipMutationApiResponse = {
  roaster_relationship: {
    id: number | null
    roaster: {
      followers_count: number
      id: number
      name: string
    }
    user: {
      following_roasters_count: number
      id: number
      name: string
    }
  }
}

export function buildUserApiResponse(input: UserApiInput): UserApiResponse {
  return {
    describe: input.describe,
    email: input.email,
    guest: input.guest,
    id: Number(input.id),
    image_url: input.image,
    name: input.name,
    prefecture_code: input.prefectureCode,
    roaster_id: input.roasterId === null ? null : Number(input.roasterId),
    thumbnail_url: input.image,
  }
}

export function buildRoasterApiResponse(input: RoasterApiInput): RoasterApiResponse {
  return {
    address: input.address,
    describe: input.describe,
    guest: input.guest,
    id: Number(input.id),
    image_url: input.image,
    name: input.name,
    phone_number: input.phoneNumber,
    prefecture_code: input.prefectureCode,
    thumbnail_url: input.image,
  }
}

export function buildRoasterDetailApiResponse(
  input: RoasterApiInput & {
    followersCount: number
    roasterRelationshipId: bigint | null
  },
): RoasterApiResponse {
  return {
    ...buildRoasterApiResponse(input),
    followers_count: input.followersCount,
    roaster_relationship_id:
      input.roasterRelationshipId === null ? null : Number(input.roasterRelationshipId),
  }
}

export function buildRoasterRelationshipStatusApiResponse(
  relationshipId: bigint | null,
): RoasterRelationshipStatusApiResponse {
  return {
    is_followed_by_signed_in_user: relationshipId !== null,
    roaster_relationship_id: relationshipId === null ? null : Number(relationshipId),
  }
}

export function buildRoasterRelationshipMutationApiResponse(
  input: RoasterRelationshipSummaryInput,
): RoasterRelationshipMutationApiResponse {
  return {
    roaster_relationship: {
      id: input.relationshipId === null ? null : Number(input.relationshipId),
      roaster: {
        followers_count: input.followersCount,
        id: Number(input.roasterId),
        name: input.roasterName,
      },
      user: {
        following_roasters_count: input.followingRoastersCount,
        id: Number(input.userId),
        name: input.userName,
      },
    },
  }
}
