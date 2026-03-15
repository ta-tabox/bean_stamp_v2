export type User = {
  email: string
  imageUrl: string | null
  thumbnailUrl: string | null
  id: number
  name: string
  prefectureCode: string
  describe: string | null
  roasterId: number | null
  guest: boolean
}

export type UserUpdateParams = Pick<User, 'email' | 'name' | 'prefectureCode' | 'describe'> & {
  image: string
}
