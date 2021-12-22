import { useState, useEffect } from 'react'
import local from './local'

const useStoredState = <T>(key: string): [T | undefined, React.Dispatch<React.SetStateAction<T>>] => {
  const [cache, setCache] = useState<T>()

  useEffect(() => {
    const saved = local.getItem<T>(key)
    setCache(saved)
  }, [key, setCache])

  useEffect(() => {
    local.setItem<T | undefined | null>(key, cache)
  }, [key, cache])

  useEffect(() => {
    const onStorageUpdate = (e: StorageEvent) => {
      const fullKey = local.prefixKey(key)
      if (e.key === fullKey && e.newValue !== e.oldValue) {
        let newState: T
        try {
          newState = e.newValue == null ? null : JSON.parse(e.newValue)
        } catch (e) {
          return
        }
        if (newState !== undefined) {
          setCache(newState)
        }
      }
    }

    window.addEventListener('storage', onStorageUpdate)

    return () => {
      window.removeEventListener('storage', onStorageUpdate)
    }
  }, [key, setCache])

  return [cache, setCache]
}

export default useStoredState
