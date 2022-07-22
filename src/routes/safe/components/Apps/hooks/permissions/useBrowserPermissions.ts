import { useState, useEffect, useCallback } from 'react'
import local from 'src/utils/storage/local'
import { AllowedFeatures, PermissionStatus } from '../../types'

const BROWSER_PERMISSIONS = 'BROWSER_PERMISSIONS'

export type BrowserPermission = { feature: AllowedFeatures; status: PermissionStatus }

type BrowserPermissions = { [origin: string]: BrowserPermission[] }

type BrowserPermissionsRequestState = {
  origin: string
  request: BrowserPermission[]
}

type UseBrowserPermissionsReturnType = {
  permissions: BrowserPermissions
  getPermissions: (origin: string) => BrowserPermission[]
  permissionsRequest: BrowserPermissionsRequestState | undefined
  setPermissionsRequest: (permissionsRequest?: BrowserPermissionsRequestState) => void
  addPermissions: (origin: string, permissions: BrowserPermission[]) => void
  getAllowedFeaturesList: (origin: string) => string
  updateBrowserPermission: (origin: string, feature: AllowedFeatures, selected: boolean) => void
}

const useBrowserPermissions = (): UseBrowserPermissionsReturnType => {
  const [permissions, setPermissions] = useState<BrowserPermissions>({})
  const [permissionsRequest, setPermissionsRequest] = useState<BrowserPermissionsRequestState | undefined>()

  useEffect(() => {
    setPermissions(local.getItem(BROWSER_PERMISSIONS) || {})
  }, [])

  useEffect(() => {
    if (!!Object.keys(permissions).length) {
      local.setItem(BROWSER_PERMISSIONS, permissions)
    }
  }, [permissions])

  const getPermissions = useCallback(
    (origin: string) => {
      return permissions[origin] || []
    },
    [permissions],
  )

  const addPermissions = useCallback(
    (origin: string, selectedPermissions: BrowserPermission[]) => {
      setPermissions({ ...permissions, [origin]: selectedPermissions })
    },
    [permissions],
  )

  const getAllowedFeaturesList = useCallback(
    (origin: string): string => {
      return getPermissions(origin)
        .filter(({ status }) => status === PermissionStatus.GRANTED)
        .map((permission) => permission.feature)
        .join('; ')
    },
    [getPermissions],
  )

  const updateBrowserPermission = useCallback(
    (origin: string, feature: AllowedFeatures, selected: boolean) => {
      setPermissions({
        ...permissions,
        [origin]: permissions[origin].map((p) => {
          if (p.feature === feature) {
            p.status = selected ? PermissionStatus.GRANTED : PermissionStatus.DENIED
          }

          return p
        }),
      })
    },
    [permissions],
  )

  return {
    permissions,
    getPermissions,
    permissionsRequest,
    setPermissionsRequest,
    addPermissions,
    getAllowedFeaturesList,
    updateBrowserPermission,
  }
}

export { useBrowserPermissions }
