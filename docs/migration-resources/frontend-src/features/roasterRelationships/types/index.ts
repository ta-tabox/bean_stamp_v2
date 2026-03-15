export type GetRoasterRelationshipResponse = {
  isFollowedBySignedInUser: boolean
  roasterRelationshipId: number
}

export type RoasterRelationshipCreateParams = {
  roasterId: number
}

export type RoasterRelationshipResponse = {
  roasterRelationship: {
    id: number
    user: {
      id: number
      name: string
      followingRoastersCount: number
    }
    roaster: {
      id: number
      name: string
      followersCount: number
    }
  }
}
