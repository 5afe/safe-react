import { Methods } from '@gnosis.pm/safe-apps-sdk'
import { Permission, PermissionCaveat, PermissionRequest } from '@gnosis.pm/safe-apps-sdk/dist/src/types/permissions'
import { useState, useCallback } from 'react'
import { PermissionStatus } from '../../types'
import { usePermissions } from './usePermissions'

const SAFE_PERMISSIONS = 'SAFE_PERMISSIONS'
const USER_RESTRICTED = 'userRestricted'

type SafePermissions = { [origin: string]: Permission[] }

type SafePermissionsRequest = {
  origin: string
  requestId: string
  request: PermissionRequest[]
}

type UseSafePermissionsReturnType = {
  permissions: SafePermissions
  getPermissions: (origin: string) => Permission[]
  updatePermission: (origin: string, capability: string, selected: boolean) => void
  permissionsRequest: SafePermissionsRequest | undefined
  setPermissionsRequest: (permissionsRequest?: SafePermissionsRequest) => void
  confirmPermissionRequest: (result: PermissionStatus) => Permission[]
  hasPermission: (origin: string, permission: Methods) => boolean
  isUserRestricted: (caveats?: PermissionCaveat[]) => boolean
}

const useSafePermissions = (): UseSafePermissionsReturnType => {
  const [permissions, setPermissions] = usePermissions<SafePermissions>({}, SAFE_PERMISSIONS)
  const [permissionsRequest, setPermissionsRequest] = useState<SafePermissionsRequest | undefined>()

  const getPermissions = useCallback(
    (origin: string) => {
      return permissions[origin] || []
    },
    [permissions],
  )

  const updatePermission = useCallback(
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
    [permissions, setPermissions],
  )

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
      setPermissionsRequest(undefined)

      return newPermissions
    },
    [permissions, setPermissions, permissionsRequest],
  )

  const hasPermission = useCallback(
    (origin: string, permission: Methods) => {
      return permissions[origin]?.some((p) => p.parentCapability === permission && !isUserRestricted(p.caveats))
    },
    [permissions],
  )

  const isUserRestricted = (caveats?: PermissionCaveat[]) =>
    !!caveats?.some((caveat) => caveat.type === USER_RESTRICTED && caveat.value === true)

  return {
    permissions,
    isUserRestricted,
    permissionsRequest,
    setPermissionsRequest,
    getPermissions,
    confirmPermissionRequest,
    hasPermission,
    updatePermission,
  }
}

export { useSafePermissions }
