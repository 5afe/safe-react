import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { AppData as RemoteSafeApp, fetchSafeAppsList } from 'src/logic/configService'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { NOTIFICATIONS } from 'src/logic/notifications'
import { FETCH_STATUS } from 'src/utils/requests'

type ReturnType = {
  remoteSafeApps: RemoteSafeApp[]
  status: FETCH_STATUS
}

const useRemoteSafeApps = (): ReturnType => {
  const [remoteSafeApps, setRemoteSafeApps] = useState<RemoteSafeApp[]>([])
  const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.NOT_ASKED)
  const dispatch = useDispatch()

  useEffect(() => {
    const loadAppsList = async () => {
      setStatus(FETCH_STATUS.LOADING)
      try {
        const result = await fetchSafeAppsList()
        if (result?.length) {
          setRemoteSafeApps(result)
          setStatus(FETCH_STATUS.SUCCESS)
        } else {
          throw new Error('Empty apps array 🤬')
        }
      } catch (e) {
        setStatus(FETCH_STATUS.ERROR)
        logError(Errors._902, e.message)
        dispatch(enqueueSnackbar(NOTIFICATIONS.SAFE_APPS_FETCH_ERROR_MSG))
      }
    }

    loadAppsList()
  }, [dispatch])

  return { remoteSafeApps, status }
}

export { useRemoteSafeApps }
