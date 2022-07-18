import { useState, useEffect, useMemo } from 'react'
import local from 'src/utils/storage/local'
import { AllowedFeatures, SafeApp } from '../../types'

const BROWSER_PERMISSIONS = 'BROWSER_PERMISSIONS'

type BrowserPermissions = { [origin: string]: AllowedFeatures[] }

type UseBrowserPermissionsProps = {
  permissions: BrowserPermissions
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateAllowList = (features: AllowedFeatures[], origin: string): string => {
  return features.reduce((acc, feature) => {
    return acc + `,${feature.toString()} ${origin}`
  }, '')
}

const useBrowserPermissions = (app: SafeApp): UseBrowserPermissionsProps => {
  const [permissions, setPermissions] = useState<BrowserPermissions>({})

  useEffect(() => {
    setPermissions(local.getItem(BROWSER_PERMISSIONS) || {})
  }, [])

  useEffect(() => {
    local.setItem(BROWSER_PERMISSIONS, permissions)
  }, [permissions])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hasPermissions = useMemo((): boolean => {
    if (!app) {
      return false
    }

    const currentAllowedFeatures = permissions?.[app.url] || []
    const requiredFeatures = Object.values(app.safeAppsPermissions) || []

    return requiredFeatures.every((feature) => currentAllowedFeatures.includes(feature))
  }, [app, permissions])

  return {
    permissions,
  }
}

export { useBrowserPermissions }
