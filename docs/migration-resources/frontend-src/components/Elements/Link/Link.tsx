import type { FC, ReactElement } from 'react'
import { memo } from 'react'
import { Link as ReactLink } from 'react-router-dom'

type Props = {
  to: string
  children: string | ReactElement
}

export const Link: FC<Props> = memo((props) => {
  const { to, children } = props
  return (
    <ReactLink
      to={`${to}`}
      className="hover:border-b border-indigo-600 text-indigo-500  hover:text-indigo-600 active:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-block"
    >
      {children}
    </ReactLink>
  )
})
