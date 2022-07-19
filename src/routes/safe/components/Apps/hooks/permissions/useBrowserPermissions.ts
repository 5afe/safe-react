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

type UseBrowserPermissionsProps = {
  permissions: BrowserPermissions
  getPermissions: (origin: string) => BrowserPermission[]
  permissionsRequest: BrowserPermissionsRequestState | undefined
  setPermissionsRequest: (permissionsRequest?: BrowserPermissionsRequestState) => void
  addPermissions: (origin: string, permissions: BrowserPermission[]) => void
  getAllowedFeaturesList: (origin: string) => string
}

const useBrowserPermissions = (): UseBrowserPermissionsProps => {
  const [permissions, setPermissions] = useState<BrowserPermissions>({})
  const [permissionsRequest, setPermissionsRequest] = useState<BrowserPermissionsRequestState | undefined>()

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

  return {
    permissions,
    getPermissions,
    permissionsRequest,
    setPermissionsRequest,
    addPermissions,
    getAllowedFeaturesList,
  }
}

export { useBrowserPermissions }
