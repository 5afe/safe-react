import { useLocation } from 'react-router-dom'
import { useCallback } from 'react'

type AppUrlReturnType = {
  getAppUrl: () => string | null
}

export const useSafeAppUrl = (): AppUrlReturnType => {
  const { search } = useLocation()

  const getAppUrl = useCallback(() => {
    const query = new URLSearchParams(search)
    return query.get('appUrl')
  }, [search])

  return {
    getAppUrl,
  }
}
