import { describe, expect, it } from "vitest"

import {
  buildRoasterDetailApiResponse,
  buildRoasterRelationshipMutationApiResponse,
  buildRoasterRelationshipStatusApiResponse,
  buildUserApiResponse,
} from "@/server/profiles/dto"

describe("profile dto builders", () => {
  it("ユーザー DTO を旧 API 形状へ変換する", () => {
    expect(
      buildUserApiResponse({
        describe: "プロフィール",
        email: "user@example.com",
        guest: false,
        id: 10n,
        name: "Test User",
        prefectureCode: "13",
        roasterId: 20n,
      }),
    ).toEqual({
      describe: "プロフィール",
      email: "user@example.com",
      guest: false,
      id: 10,
      image_url: null,
      name: "Test User",
      prefecture_code: "13",
      roaster_id: 20,
      thumbnail_url: null,
    })
  })

  it("ロースター詳細 DTO にフォロー情報を含める", () => {
    expect(
      buildRoasterDetailApiResponse({
        address: "Tokyo",
        describe: null,
        followersCount: 3,
        guest: false,
        id: 5n,
        name: "Roaster",
        phoneNumber: "03-0000-0000",
        prefectureCode: "13",
        roasterRelationshipId: 11n,
      }),
    ).toEqual({
      address: "Tokyo",
      describe: null,
      followers_count: 3,
      guest: false,
      id: 5,
      image_url: null,
      name: "Roaster",
      phone_number: "03-0000-0000",
      prefecture_code: "13",
      roaster_relationship_id: 11,
      thumbnail_url: null,
    })
  })

  it("フォロー状態 DTO を旧 API 形状へ変換する", () => {
    expect(buildRoasterRelationshipStatusApiResponse(null)).toEqual({
      is_followed_by_signed_in_user: false,
      roaster_relationship_id: null,
    })
  })

  it("フォロー作成・解除レスポンス DTO を構築する", () => {
    expect(
      buildRoasterRelationshipMutationApiResponse({
        followersCount: 7,
        followingRoastersCount: 2,
        relationshipId: null,
        roasterId: 30n,
        roasterName: "Bean Roaster",
        userId: 12n,
        userName: "Alice",
      }),
    ).toEqual({
      roaster_relationship: {
        id: null,
        roaster: {
          followers_count: 7,
          id: 30,
          name: "Bean Roaster",
        },
        user: {
          following_roasters_count: 2,
          id: 12,
          name: "Alice",
        },
      },
    })
  })
})
