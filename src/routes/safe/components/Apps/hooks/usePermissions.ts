import { Permission, PermissionRequest } from '@gnosis.pm/safe-apps-sdk/dist/src/types/permissions'
import { useState, useEffect, useCallback } from 'react'
import local from 'src/utils/storage/local'

const APPS_PERMISSIONS = 'APPS_PERMISSIONS'

type PermissionsRequestState = {
  origin: string
  requestId: string
  request: PermissionRequest[]
}

type UsePermissionsProps = {
  getPermissions: (origin: string) => Permission[]
  permissionsRequest: PermissionsRequestState | undefined
  setPermissionsRequest: (permissionsRequest?: PermissionsRequestState) => void
  addPermissions: () => void
}

const usePermissions = (): UsePermissionsProps => {
  const [permissions, setPermissions] = useState<{ [origin: string]: Permission[] }>({})
  const [permissionsRequest, setPermissionsRequest] = useState<PermissionsRequestState | undefined>()

  useEffect(() => {
    setPermissions(local.getItem(APPS_PERMISSIONS) || {})
  }, [])

  useEffect(() => {
    local.setItem(APPS_PERMISSIONS, permissions)
  }, [permissions])

  const addPermissions = useCallback((): Permission[] => {
    if (!permissionsRequest) {
      return []
    }

    const newPermissions: Permission[] = []

    permissionsRequest.request.forEach((requestedPermission) => {
      if (
        !permissions[permissionsRequest.origin]?.find(
          (p: Permission) => p.parentCapability === Object.keys(requestedPermission)[0],
        )
      ) {
        newPermissions.push({
          invoker: permissionsRequest.origin,
          parentCapability: Object.keys(requestedPermission)[0],
          date: new Date().getTime(),
        })
      }
    })

    const updatedPermissions = [...(permissions[permissionsRequest.origin] || []), ...newPermissions]

    setPermissions({
      ...permissions,
      [permissionsRequest.origin]: updatedPermissions,
    })

    return updatedPermissions
  }, [permissions, permissionsRequest])

  const getPermissions = useCallback(
    (origin: string) => {
      return permissions[origin] || []
    },
    [permissions],
  )

  return {
    permissionsRequest,
    setPermissionsRequest,
    getPermissions,
    addPermissions,
  }
}

export { usePermissions }
