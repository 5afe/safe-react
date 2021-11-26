import { useState, useEffect } from 'react'
import local from './local'

const useStoredState = <T>(key: string): [T | undefined, React.Dispatch<React.SetStateAction<T>>] => {
  const [cache, setCache] = useState<T>()

  useEffect(() => {
    const saved = local.getItem<T>(key)
    setCache(saved)
  }, [key, setCache])

  useEffect(() => {
    local.setItem<T | undefined>(key, cache)
  }, [key, cache])

  return [cache, setCache]
}

export default useStoredState
