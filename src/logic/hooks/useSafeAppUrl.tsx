import { useLocation } from 'react-router-dom'
import { useCallback } from 'react'
import { sanitizeUrl } from 'src/utils/sanitizeUrl'

type AppUrlReturnType = {
  getAppUrl: () => string
}

export const useSafeAppUrl = (): AppUrlReturnType => {
  const { search } = useLocation()

  const getAppUrl = useCallback(() => {
    const query = new URLSearchParams(search)
    try {
      const url = query.get('appUrl')

      return sanitizeUrl(url)
    } catch {
      throw new Error('Detected javascript injection in the URL. Check the appUrl parameter')
    }
  }, [search])

  return {
    getAppUrl,
  }
}
