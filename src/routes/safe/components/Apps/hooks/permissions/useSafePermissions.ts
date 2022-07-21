import { Methods } from '@gnosis.pm/safe-apps-sdk'
import { Permission, PermissionCaveat, PermissionRequest } from '@gnosis.pm/safe-apps-sdk/dist/src/types/permissions'
import { useState, useEffect, useCallback } from 'react'
import local from 'src/utils/storage/local'
import { PermissionStatus } from '../../types'

const SAFE_PERMISSIONS = 'SAFE_PERMISSIONS'
const USER_RESTRICTED = 'userRestricted'

type SafePermissions = { [origin: string]: Permission[] }

type SafePermissionsRequest = {
  origin: string
  requestId: string
  request: PermissionRequest[]
}

type UseSafePermissionsProps = {
  permissions: SafePermissions
  isUserRestricted: (caveats?: PermissionCaveat[]) => boolean
  getPermissions: (origin: string) => Permission[]
  permissionsRequest: SafePermissionsRequest | undefined
  setPermissionsRequest: (permissionsRequest?: SafePermissionsRequest) => void
  confirmPermissionRequest: (result: PermissionStatus) => Permission[]
  hasPermissions: (origin: string, permission: Methods) => boolean
  updateSafePermission: (origin: string, capability: string, selected: boolean) => void
}

const useSafePermissions = (): UseSafePermissionsProps => {
  const [permissions, setPermissions] = useState<SafePermissions>({})
  const [permissionsRequest, setPermissionsRequest] = useState<SafePermissionsRequest | undefined>()

  useEffect(() => {
    setPermissions(local.getItem(SAFE_PERMISSIONS) || {})
  }, [])

  useEffect(() => {
    if (!!Object.keys(permissions).length) {
      local.setItem(SAFE_PERMISSIONS, permissions)
    }
  }, [permissions])

  const confirmPermissionRequest = useCallback(
    (result) => {
      if (!permissionsRequest) {
        return []
      }

      const newPermissions: Permission[] = [...(permissions[permissionsRequest.origin] || [])]

      permissionsRequest.request.forEach((requestedPermission) => {
        const capability = Object.keys(requestedPermission)[0]
        const currentPermission = permissions[permissionsRequest.origin]?.find(
          (p: Permission) => p.parentCapability === capability,
        )

        if (!currentPermission) {
          const newPermission: Permission = {
            invoker: permissionsRequest.origin,
            parentCapability: capability,
            date: new Date().getTime(),
          }

          if (result === PermissionStatus.DENIED) {
            newPermission.caveats = [
              {
                type: USER_RESTRICTED,
                value: true,
              },
            ]
          }
          newPermissions.push(newPermission)
        } else {
          newPermissions.map((permission) => {
            if (permission.parentCapability === capability) {
              const filteredCaveats = permission.caveats?.filter((caveat) => caveat.type !== USER_RESTRICTED) || []
              if (result === PermissionStatus.GRANTED) {
                permission.caveats = filteredCaveats
              } else {
                permission.caveats = [
                  ...filteredCaveats,
                  {
                    type: USER_RESTRICTED,
                    value: true,
                  },
                ]
              }
            }
          })
        }
      })

      const updatedPermissions = {
        ...permissions,
        [permissionsRequest.origin]: newPermissions,
      }

      setPermissions(updatedPermissions)

      return newPermissions
    },
    [permissions, permissionsRequest],
  )

  const getPermissions = useCallback(
    (origin: string) => {
      return permissions[origin] || []
    },
    [permissions],
  )

  const hasPermissions = useCallback(
    (origin: string, permission: Methods) => {
      return permissions[origin]?.some((p) => p.parentCapability === permission && !isUserRestricted(p.caveats))
    },
    [permissions],
  )

  const isUserRestricted = (caveats?: PermissionCaveat[]) =>
    !!caveats?.some((caveat) => caveat.type === USER_RESTRICTED && caveat.value === true)

  const updateSafePermission = useCallback(
    (origin: string, capability: string, selected: boolean) => {
      setPermissions({
        ...permissions,
        [origin]: permissions[origin].map((permission) => {
          if (permission.parentCapability === capability) {
            if (selected) {
              permission.caveats = permission.caveats?.filter((caveat) => caveat.type !== USER_RESTRICTED) || []
            } else if (!isUserRestricted(permission.caveats)) {
              permission.caveats = [
                ...(permission.caveats || []),
                {
                  type: USER_RESTRICTED,
                  value: true,
                },
              ]
            }
          }

          return permission
        }),
      })
    },
    [permissions],
  )

  return {
    permissions,
    isUserRestricted,
    permissionsRequest,
    setPermissionsRequest,
    getPermissions,
    confirmPermissionRequest,
    hasPermissions,
    updateSafePermission,
  }
}

export { useSafePermissions }
