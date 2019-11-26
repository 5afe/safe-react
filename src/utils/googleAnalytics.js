// @flow
import React, { Component, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { getGoogleAnalyticsTrackingID } from '~/config'
import { loadFromStorage } from '~/utils/storage'
import { COOKIES_KEY } from '~/logic/cookies/model/cookie'
import type { CookiesProps } from '~/logic/cookies/model/cookie'

const trackingID = getGoogleAnalyticsTrackingID()

if (!trackingID) {
  console.error('[GoogleAnalytics] - In order to use google analytics you need to add an trackingID')
} else {
  GoogleAnalytics.initialize(trackingID)
}


const withTracker = (WrappedComponent, options = {}) => {
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

  const trackPage = (page) => {
    if (!useAnalytics) {
      return
    }
    GoogleAnalytics.set({
      page,
      ...options,
    })
    GoogleAnalytics.pageview(page)
  }

  // eslint-disable-next-line
  const HOC = class extends Component {
    componentDidMount() {
      // eslint-disable-next-line
      const page = this.props.location.pathname + this.props.location.search;
      trackPage(page)
    }

    componentDidUpdate(prevProps) {
      // eslint-disable-next-line react/prop-types
      const currentPage = prevProps.location.pathname + prevProps.location.search
      // eslint-disable-next-line react/prop-types,react/destructuring-assignment
      const nextPage = this.props.location.pathname + this.props.location.search

      if (currentPage !== nextPage) {
        trackPage(nextPage)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return HOC
}

export default withTracker
