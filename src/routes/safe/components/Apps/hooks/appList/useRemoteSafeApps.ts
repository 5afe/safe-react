import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SafeAppData } from '@gnosis.pm/safe-react-gateway-sdk'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { showNotification } from 'src/logic/notifications/store/notifications'
import { NOTIFICATIONS } from 'src/logic/notifications'
import { FETCH_STATUS } from 'src/utils/requests'
import { SafeApp } from '../../types'
import { fetchSafeAppsList } from 'src/logic/safe/api/fetchSafeApps'

type ReturnType = {
  remoteSafeApps: SafeApp[]
  status: FETCH_STATUS
}

// Memoize the fetch request so that simulteneous calls
// to this function return the same promise
let fetchPromise: Promise<SafeAppData[]> | null = null
const memoizedFetchSafeApps = (): Promise<SafeAppData[]> => {
  if (!fetchPromise) {
    fetchPromise = fetchSafeAppsList()
  }
  fetchPromise.finally(() => (fetchPromise = null))
  return fetchPromise
}

const useRemoteSafeApps = (): ReturnType => {
  const [remoteSafeApps, setRemoteSafeApps] = useState<SafeApp[]>([])
  const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.NOT_ASKED)
  const dispatch = useDispatch()

  // useEffect(() => {
  //   const loadAppsList = async () => {
  //     setStatus(FETCH_STATUS.LOADING)
  //     try {
  //       const result = await memoizedFetchSafeApps()

  //       if (result?.length) {
  //         setRemoteSafeApps(result.map((app) => ({ ...app, fetchStatus: FETCH_STATUS.SUCCESS, id: String(app.id) })))
  //         setStatus(FETCH_STATUS.SUCCESS)
  //       } else {
  //         throw new Error('Empty apps array 🤬')
  //       }
  //     } catch (e) {
  //       setStatus(FETCH_STATUS.ERROR)
  //       logError(Errors._902, e.message)
  //       dispatch(showNotification(NOTIFICATIONS.SAFE_APPS_FETCH_ERROR_MSG))
  //     }
  //   }

  //   loadAppsList()
  // }, [dispatch])

  return { remoteSafeApps, status }
}

export { useRemoteSafeApps }
