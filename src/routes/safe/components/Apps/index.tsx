import React from 'react'
import { useGetSafeAppUrl } from 'src/logic/hooks/useGetSafeAppUrl'

import AppFrame from './components/AppFrame'
import AppsList from './components/AppsList'

const Apps = (): React.ReactElement => {
  const { url } = useGetSafeAppUrl()

  if (url) {
    return <AppFrame appUrl={url} />
  } else {
    return <AppsList />
  }
}

export default Apps
