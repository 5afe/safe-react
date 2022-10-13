import { useState, useEffect } from 'react'
import local from './local'
import session from './session'

const useCachedState = <T>(
  key: string,
  isSession = false,
): [T | undefined, React.Dispatch<React.SetStateAction<T>>] => {
  const [cache, setCache] = useState<T>()
  const storage = isSession ? session : local

  useEffect(() => {
    const saved = storage.getItem<T>(key)
    setCache(saved)
  }, [key, storage, setCache])

  useEffect(() => {
    storage.setItem<T | undefined>(key, cache)
  }, [key, storage, cache])

  return [cache, setCache]
}

export default useCachedState
