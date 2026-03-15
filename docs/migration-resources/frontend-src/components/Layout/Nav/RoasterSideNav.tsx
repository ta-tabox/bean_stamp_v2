import type { FC } from 'react'
import { memo } from 'react'

import { SideNavLink } from '@/components/Elements/Link'
import { useAuth } from '@/features/auth'
import type { Roaster } from '@/features/roasters'

type Props = {
  roaster: Roaster
}

export const RoasterSideNav: FC<Props> = memo((props) => {
  const { roaster } = props
  const { signOut } = useAuth()

  const onClickSingOut = () => {
    signOut()
  }

  return (
    <ul className="flex flex-col">
      {/* ロースター用 */}
      {/* ロースターホームリンク */}
      <li className="mb-2">
        <SideNavLink title="Home" to="/roasters/home">
          <svg className="h-8 w-8">
            <use xlinkHref="#home" />
          </svg>
        </SideNavLink>
      </li>
      {/* ロースターページリンク */}
      <li className="mb-2">
        <SideNavLink title="Roaster" to={`/roasters/${roaster.id}`}>
          <svg className="h-8 w-8">
            <use xlinkHref="#coffee-cup" />
          </svg>
        </SideNavLink>
      </li>
      {/* ビーンズリンク */}
      <li className="mb-2">
        <SideNavLink title="Beans" to="/beans">
          <svg className="h-8 w-8 transform -rotate-45">
            <use xlinkHref="#coffee-bean" />
          </svg>
        </SideNavLink>
      </li>
      {/* オファーリンク */}
      <li className="mb-2">
        <SideNavLink title="Offers" to="/offers">
          <svg className="h-8 w-8">
            <use xlinkHref="#clipboard" />
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
      {/* サインアウトリンク */}
      <li className="mb-2">
        <button type="button" onClick={onClickSingOut}>
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
