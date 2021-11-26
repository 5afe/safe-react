import { useState, useEffect } from 'react'
import { getItem, setItem } from './local'

const useStoredState = <T>(key: string): [T | undefined, React.Dispatch<React.SetStateAction<T>>] => {
  const [cache, setCache] = useState<T>()

  useEffect(() => {
    const saved = getItem<T>(key)
    setCache(saved)
  }, [key, setCache])

  useEffect(() => {
    setItem<T | undefined>(key, cache)
  }, [key, cache])

  return [cache, setCache]
}

export default useStoredState
