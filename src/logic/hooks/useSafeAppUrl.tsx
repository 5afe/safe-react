import { useLocation } from 'react-router-dom'
import { useCallback } from 'react'
import { sanitizeUrl } from 'src/utils/sanitizeUrl'

type AppUrlReturnType = {
  getAppUrl: () => string | null
}

export const useSafeAppUrl = (): AppUrlReturnType => {
  const { search } = useLocation()

  const getAppUrl = useCallback(() => {
    const query = new URLSearchParams(search)
    return sanitizeUrl(query.get('appUrl'))
  }, [search])

  return {
    getAppUrl,
  }
}
