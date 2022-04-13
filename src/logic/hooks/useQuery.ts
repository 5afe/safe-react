import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const useQuery = (): URLSearchParams => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export { useQuery }
