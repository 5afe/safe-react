import { useState, useEffect, useCallback } from 'react'
import local from 'src/utils/storage/local'
import { AllowedFeatures } from '../../types'

const BROWSER_PERMISSIONS = 'BROWSER_PERMISSIONS'

type BrowserPermissions = { [origin: string]: AllowedFeatures[] }

type UseBrowserPermissionsProps = {
  permissions: BrowserPermissions
  getPermissions: (origin: string) => AllowedFeatures[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateAllowList = (features: AllowedFeatures[], origin: string): string => {
  return features.reduce((acc, feature) => {
    return acc + `,${feature.toString()} ${origin}`
  }, '')
}

const useBrowserPermissions = (): UseBrowserPermissionsProps => {
  const [permissions, setPermissions] = useState<BrowserPermissions>({})

  useEffect(() => {
    setPermissions(local.getItem(BROWSER_PERMISSIONS) || {})
  }, [])

  useEffect(() => {
    local.setItem(BROWSER_PERMISSIONS, permissions)
  }, [permissions])

  const getPermissions = useCallback(
    (origin: string) => {
      return permissions[origin] || []
    },
    [permissions],
  )

  return {
    permissions,
    getPermissions,
  }
}

export { useBrowserPermissions }
