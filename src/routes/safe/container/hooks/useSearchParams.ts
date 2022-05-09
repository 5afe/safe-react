import { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

const tryParse = <T extends string>(value: T): ReturnType<typeof JSON.parse> | T => {
  try {
    return JSON.parse(value)
  } catch {
    return value === 'undefined' ? undefined : value
  }
}

type Primitive = string | number | boolean | null
type Params = Record<string, Primitive>

export const parseSearch = (search: string): Params => {
  return Array.from(new URLSearchParams(search)).reduce((acc, cur) => {
    const [key, value] = cur.map(decodeURIComponent)
    return {
      ...acc,
      [key]: tryParse(value),
    }
  }, {})
}

const useSearchParams = (): [Params, (params?: Params) => void] => {
  const { pathname, search } = useLocation()
  const history = useHistory()
  const [searchParams, setSearchParams] = useState(parseSearch(search))

  useEffect(() => {
    setSearchParams(parseSearch(search))
  }, [search])

  const setParams = (params?: Params) => {
    if (!params) {
      history.replace(pathname)
      setSearchParams({})
    } else {
      const entries = Object.entries(params).map(([key, value]) => [key, String(value)])
      history.replace(`${pathname}?${new URLSearchParams(entries).toString()}`)
      setSearchParams(params)
    }
  }

  return [searchParams, setParams]
}

export default useSearchParams
