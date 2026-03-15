import type { FC } from 'react'

import { Pivot as ReactHamburger } from 'hamburger-react'

type Props = {
  toggled: boolean
  toggle: React.Dispatch<React.SetStateAction<boolean>>
}

export const Hamburger: FC<Props> = (props) => {
  const { toggled, toggle } = props
  return (
    <div className="text-gray-500">
      <ReactHamburger toggled={toggled} toggle={toggle} duration={0.8} />
    </div>
  )
}
