import React from 'react'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'

import AppFrame from './components/AppFrame'
import AppsList from './components/AppsList'

const Apps = (): React.ReactElement => {
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()
  if (url) {
    return <AppFrame appUrl={url} />
  } else {
    return <AppsList />
  }
}

export default Apps
