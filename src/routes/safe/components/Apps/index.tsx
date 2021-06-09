import React from 'react'

import { useLocation } from 'react-router-dom'

import AppFrame from './components/AppFrame'
import AppsList from './components/AppsList'

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const Apps = (): React.ReactElement => {
  const query = useQuery()
  const appUrl = query.get('appUrl')

  if (appUrl) {
    return <AppFrame appUrl={appUrl} />
  } else {
    return <AppsList />
  }
}

export default Apps
