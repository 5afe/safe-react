import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SnackbarKey, useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { selectNotifications, closeNotification } from 'src/logic/notifications/store/notifications'

let onScreenKeys: SnackbarKey[] = []

const useNotifier = (): void => {
  const notifications = useSelector(selectNotifications)
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  useEffect(() => {
    for (const notification of notifications) {
      // Unspecified keys are automatically generated in `enqueueSnackbar` thunk
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const key = notification.options!.key!

      if (notification.dismissed) {
        closeSnackbar(key)
        continue
      }

      if (onScreenKeys.includes(key)) {
        continue
      }

      enqueueSnackbar(notification.message, {
        ...notification.options,
        onExited: () => {
          // Cleanup store/cache when notification has unmounted
          dispatch(closeNotification({ key }))
          onScreenKeys = onScreenKeys.filter((onScreenKey) => onScreenKey !== key)
        },
        action: (
          <IconButton onClick={() => dispatch(closeNotification({ key }))}>
            <CloseIcon />
          </IconButton>
        ),
      })

      onScreenKeys = [...onScreenKeys, key]
    }
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch])
}

export default useNotifier
