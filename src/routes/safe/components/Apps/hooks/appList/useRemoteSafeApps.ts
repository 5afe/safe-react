import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { AppData as RemoteSafeApp, fetchSafeAppsList } from 'src/logic/configService'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { NOTIFICATIONS } from 'src/logic/notifications'

type ReturnType = {
  remoteSafeApps: RemoteSafeApp[]
  loading: boolean
}

const useRemoteSafeApps = (): ReturnType => {
  const [remoteSafeApps, setRemoteSafeApps] = useState<RemoteSafeApp[]>([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const loadAppsList = async () => {
      setLoading(true)
      try {
        const result = await fetchSafeAppsList()
        if (result?.length) {
          setRemoteSafeApps(result)
        }
      } catch (e) {
        logError(Errors._902, e.message)
        dispatch(enqueueSnackbar(NOTIFICATIONS.SAFE_APPS_FETCH_ERROR_MSG))
      } finally {
        setLoading(false)
      }
    }

    loadAppsList()
  }, [dispatch])

  return { remoteSafeApps, loading }
}

export { useRemoteSafeApps }
