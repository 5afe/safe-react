import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

type AppUrlReturnType = {
  url: string | null
}

export const useSafeAppUrl = (): AppUrlReturnType => {
  const [url, setUrl] = useState<string | null>(null)
  const { search } = useLocation()

  useEffect(() => {
    if (search !== url) {
      const query = new URLSearchParams(search)
      setUrl(query.get('appUrl'))
    }
  }, [search, url])

  return {
    url,
  }
}
