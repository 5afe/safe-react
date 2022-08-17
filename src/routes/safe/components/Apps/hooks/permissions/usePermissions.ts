import { useState, useEffect } from 'react'
import local from 'src/utils/storage/local'

const hasAnyKey = (obj: Record<string, any>) => !!Object.keys(obj).length

const usePermissions = <T>(initialValue: T, storageKey: string): [T, (state: T) => void] => {
  const [permissions, setPermissions] = useState<T>(() => local.getItem(storageKey) || initialValue)

  useEffect(() => {
    if (hasAnyKey(permissions)) {
      local.setItem(storageKey, permissions)
    }
  }, [permissions, storageKey])

  return [permissions, setPermissions]
}

export { usePermissions }
