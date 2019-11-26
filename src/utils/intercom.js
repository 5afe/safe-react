// @flow
import React, { useState, useEffect } from 'react'
import Intercom from 'react-intercom'
import { loadFromStorage } from '~/utils/storage'
import { COOKIES_KEY } from '~/logic/cookies/model/cookie'
import { getIntercomId } from '~/config'
import type { CookiesProps } from '~/logic/cookies/model/cookie'

const IntercomComponent = () => {
  const [useAnalytics, setUseAnalytics] = useState(false)
  useEffect(() => {
    async function fetchCookiesFromStorage() {
      const cookiesState: CookiesProps = await loadFromStorage(COOKIES_KEY)
      if (cookiesState) {
        const { acceptedAnalytics } = cookiesState
        setUseAnalytics(acceptedAnalytics)
      }
    }
    fetchCookiesFromStorage()
  }, [])


  const APP_ID = getIntercomId()
  if (!APP_ID) {
    console.error('[Intercom] - In order to use Intercom you need to add an appID')
    return null
  }
  if (!useAnalytics) {
    return null
  }

  return <Intercom appID={APP_ID} />
}

export default IntercomComponent
