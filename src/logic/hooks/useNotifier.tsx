import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SnackbarKey, useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { selectNotifications, closeNotification } from 'src/logic/notifications/store/notifications'
import NotificationLink from 'src/components/AppLayout/Header/components/Notifications/NotificationLink'

let onScreenKeys: SnackbarKey[] = []

const useNotifier = (): void => {
  const notifications = useSelector(selectNotifications)
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  useEffect(() => {
    for (const notification of notifications) {
      const { key } = notification.options

      // Dismiss notification via Notistack
      if (notification.dismissed) {
        closeSnackbar(key)
        continue
      }

      // Do nothing if notification is already on screen
      if (onScreenKeys.includes(key)) {
        continue
      }

      // `onExited` runs after a notification unmounts meaning that already
      // closed notifications would 'close' again, marking them as unread
      let wasClosed = false

      // Display notification with Notistack
      enqueueSnackbar(
        <div>
          <div>{notification.message}</div>
          {notification.link && (
            <NotificationLink
              {...notification.link}
              onClick={() => {
                closeSnackbar(key)
                wasClosed = true
              }}
            />
          )}
        </div>,
        {
          ...notification.options,
          onExited: () => {
            // Cleanup store/cache when notification has unmounted
            if (!wasClosed) {
              dispatch(closeNotification({ key, read: false }))
            }
            onScreenKeys = onScreenKeys.filter((onScreenKey) => onScreenKey !== key)
          },
          action: (
            <IconButton
              onClick={() => {
                dispatch(closeNotification({ key }))
                wasClosed = true
              }}
            >
              <CloseIcon />
            </IconButton>
          ),
        },
      )

      onScreenKeys = [...onScreenKeys, key]
    }
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch])
}

export default useNotifier
