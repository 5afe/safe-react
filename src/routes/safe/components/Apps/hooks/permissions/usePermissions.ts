import { useState, useEffect } from 'react'
import local from 'src/utils/storage/local'

const usePermissions = <T>(storageKey: string): [T, (state: T) => void] => {
  const [permissions, setPermissions] = useState<T>((local.getItem(storageKey) || {}) as T)

  useEffect(() => {
    local.setItem(storageKey, permissions)
  }, [permissions, storageKey])

  return [permissions, setPermissions]
}

export { usePermissions }
