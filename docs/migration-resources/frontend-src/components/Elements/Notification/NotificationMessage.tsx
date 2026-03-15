import type { FC } from 'react'
import { memo } from 'react'

import type { Notification } from '@/stores/notificationsState'

type Props = {
  notifications: Notification[] | null
  type: 'info' | 'warning' | 'success' | 'error'
}

export const NotificationMessage: FC<Props> = memo((props) => {
  const { notifications, type } = props

  const baseStyle = 'border rounded text-sm p-4 my-4 flex justify-between'
  const typeStyle = {
    info: 'bg-blue-50 border-blue-400 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
  }

  return (
    <div className={`${baseStyle} ${typeStyle[type]}`}>
      <div className="flex items-center">
        <svg className="w-6 h-6 mr-2">
          <use xlinkHref="#information-circle" />
        </svg>
        <div id="error_explanation">
          <p className="font-medium" />
          <ul>
            {notifications?.map((notification) => (
              <li key={notification.id}>{`${notification.message}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
})
