import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const App = (): React.ReactElement => {
  const query = useQuery()
  const appUrl = query.get('appUrl')

  useEffect(() => {
    if (!appUrl) {
      throw Error('No safe-app provided')
    }
  }, [appUrl])

  return <div>ID: {appUrl} </div>
}

export default App
