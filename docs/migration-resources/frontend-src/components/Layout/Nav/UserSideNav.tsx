import type { FC } from 'react'
import { memo } from 'react'

import { SideNavLink } from '@/components/Elements/Link'
import { useAuth } from '@/features/auth'
import type { User } from '@/features/users'
import { useWantsStats } from '@/features/wants'

type Props = {
  user: User
}

// ユーザー用
export const UserSideNav: FC<Props> = memo((props) => {
  const { user } = props
  const { signOut } = useAuth()
  const { activeWantsStats } = useWantsStats()

  const onClickSignOut = () => {
    signOut()
  }

  if (typeof user === null) {
    return null
  }

  return (
    <ul className="flex flex-col">
      {/* ユーザーホームリンク */}
      <li className="mb-2">
        <SideNavLink title="Home" to="/users/home">
          <svg className="h-8 w-8">
            <use xlinkHref="#home" />
          </svg>
        </SideNavLink>
      </li>
      {/* マイページリンク */}
      <li className="mb-2">
        <SideNavLink title="User" to={`/users/${user.id}`}>
          <svg className="h-8 w-8">
            <use xlinkHref="#user" />
          </svg>
        </SideNavLink>
      </li>
      {/* フォローリンク */}
      <li className="mb-2">
        <SideNavLink title="Follow" to={`/users/${user.id}/following`}>
          <svg className="h-8 w-8">
            <use xlinkHref="#star" />
          </svg>
        </SideNavLink>
      </li>
      {/* ウォントリンク */}
      <li className="mb-2">
        <SideNavLink title="Wants" to="/wants" badgeNumber={activeWantsStats}>
          <svg className="h-8 w-8">
            <use xlinkHref="#shopping-bag" />
          </svg>
        </SideNavLink>
      </li>
      {/* お気に入りリンク */}
      <li className="mb-2">
        <SideNavLink title="Likes" to="/likes">
          <svg className="h-8 w-8">
            <use xlinkHref="#heart" />
          </svg>
        </SideNavLink>
      </li>
      {/* 共通 */}
      {/* 検索リンク */}
      <li className="mb-2">
        <SideNavLink title="Search" to="/search">
          <svg className="h-8 w-8">
            <use xlinkHref="#search" />
          </svg>
        </SideNavLink>
      </li>
      {/* ヘルプリンク */}
      <li className="mb-2">
        <SideNavLink title="Help" to="/help">
          <svg className="h-8 w-8">
            <use xlinkHref="#question-mark-circle" />
          </svg>
        </SideNavLink>
      </li>
      {/* ログアウトリンク */}
      <li className="mb-2">
        <button type="button" onClick={onClickSignOut}>
          <SideNavLink title="SignOut" to="#">
            <svg className="h-8 w-8">
              <use xlinkHref="#logout" />
            </svg>
          </SideNavLink>
        </button>
      </li>
    </ul>
  )
})
