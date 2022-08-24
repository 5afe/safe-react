import { ReactElement, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'
import { Text, Link, Icon } from '@gnosis.pm/safe-react-components'

import Block from 'src/components/layout/Block'
import { grey400, lg } from 'src/theme/variables'
import Heading from 'src/components/layout/Heading'
import {
  useSafePermissions,
  useBrowserPermissions,
  SAFE_PERMISSIONS_TEXTS,
  BROWSER_PERMISSIONS_TEXTS,
} from 'src/routes/safe/components/Apps/hooks/permissions'
import { AllowedFeatures, PermissionStatus } from 'src/routes/safe/components/Apps/types'
import PermissionsCheckbox from 'src/routes/safe/components/Apps/components/PermissionCheckbox'
import { useAppList } from '../../Apps/hooks/appList/useAppList'

const SafeAppsPermissions = (): ReactElement => {
  const { isLoading, allApps } = useAppList()
  const {
    permissions: safePermissions,
    updatePermission: updateSafePermission,
    removePermissions: removeSafePermissions,
    isUserRestricted,
  } = useSafePermissions()
  const {
    permissions: browserPermissions,
    updatePermission: updateBrowserPermission,
    removePermissions: removeBrowserPermissions,
  } = useBrowserPermissions()
  const domains = useMemo(() => {
    const mergedPermissionsSet = new Set(Object.keys(browserPermissions).concat(Object.keys(safePermissions)))

    return Array.from(mergedPermissionsSet)
  }, [safePermissions, browserPermissions])

  const handleSafePermissionsChange = (origin: string, capability: string, checked: boolean) =>
    updateSafePermission(origin, [{ capability, selected: checked }])

  const handleBrowserPermissionsChange = (origin: string, feature: AllowedFeatures, checked: boolean) =>
    updateBrowserPermission(origin, [{ feature, selected: checked }])

  const updateAllPermissions = useCallback(
    (origin: string, selected: boolean) => {
      if (safePermissions[origin]?.length)
        updateSafePermission(
          origin,
          safePermissions[origin].map(({ parentCapability }) => ({ capability: parentCapability, selected })),
        )

      if (browserPermissions[origin]?.length)
        updateBrowserPermission(
          origin,
          browserPermissions[origin].map(({ feature }) => ({ feature, selected })),
        )
    },
    [browserPermissions, safePermissions, updateBrowserPermission, updateSafePermission],
  )

  const handleAllowAll = useCallback(
    (event: React.MouseEvent, origin: string) => {
      event.preventDefault()
      updateAllPermissions(origin, true)
    },
    [updateAllPermissions],
  )

  const handleClearAll = useCallback(
    (event: React.MouseEvent, origin: string) => {
      event.preventDefault()
      updateAllPermissions(origin, false)
    },
    [updateAllPermissions],
  )

  const handleRemoveApp = useCallback(
    (event: React.MouseEvent, origin: string) => {
      event.preventDefault()
      removeSafePermissions(origin)
      removeBrowserPermissions(origin)
    },
    [removeBrowserPermissions, removeSafePermissions],
  )

  const appNames = useMemo(() => {
    const appNames = allApps.reduce((acc, app) => {
      acc[app.url] = app.name
      return acc
    }, {})

    return appNames
  }, [allApps])

  if (isLoading) {
    return <div />
  }

  return (
    <StyledContainer>
      <Heading tag="h2">Safe Apps Permissions</Heading>
      <br />
      {!domains.length && <Text size="lg">There are no Safe Apps using permissions</Text>}
      {domains.map((domain) => (
        <StyledPermissionsCard item key={domain}>
          <StyledPermissionsCardBody container>
            <StyledSafeAppInfo item xs={12} sm={5}>
              <Text size="xl" strong>
                {appNames[domain]}
              </Text>
              <Text size="lg">{domain}</Text>
            </StyledSafeAppInfo>
            <Grid container item xs={12} sm={7}>
              {safePermissions[domain]?.map(({ parentCapability, caveats }) => {
                return (
                  <Grid key={parentCapability} item xs={12} sm={6} lg={4} xl={3}>
                    <PermissionsCheckbox
                      name={parentCapability}
                      label={SAFE_PERMISSIONS_TEXTS[parentCapability].displayName}
                      onChange={(_, checked: boolean) => handleSafePermissionsChange(domain, parentCapability, checked)}
                      checked={!isUserRestricted(caveats)}
                    />
                  </Grid>
                )
              })}
              {browserPermissions[domain]?.map(({ feature, status }) => {
                return (
                  <Grid key={feature} item xs={12} sm={6} lg={4} xl={3}>
                    <PermissionsCheckbox
                      name={feature.toString()}
                      label={BROWSER_PERMISSIONS_TEXTS[feature].displayName}
                      onChange={(_, checked: boolean) => handleBrowserPermissionsChange(domain, feature, checked)}
                      checked={status === PermissionStatus.GRANTED ? true : false}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </StyledPermissionsCardBody>
          <StyledPermissionsCardFooter container item justifyContent="flex-end">
            <StyledLink href="#" size="lg" onClick={(event) => handleAllowAll(event, domain)}>
              Allow all
            </StyledLink>
            <StyledLink href="#" color="error" size="lg" onClick={(event) => handleClearAll(event, domain)}>
              Clear all
            </StyledLink>
            <StyledLink href="#" color="error" size="lg" onClick={(event) => handleRemoveApp(event, domain)}>
              <Icon size="sm" type="delete" color="error" tooltip="Remove app permissions" />
            </StyledLink>
          </StyledPermissionsCardFooter>
        </StyledPermissionsCard>
      ))}
    </StyledContainer>
  )
}

const StyledContainer = styled(Block)`
  padding: ${lg};
`

const StyledPermissionsCard = styled(Grid)`
  border: 2px solid ${grey400};
  border-radius: 8px;
  margin-bottom: 16px;
`

const StyledPermissionsCardBody = styled(Grid)`
  padding: 15px 24px;
  border-bottom: 2px solid ${grey400};
`

const StyledPermissionsCardFooter = styled(Grid)`
  padding: 12px 24px;
`

const StyledSafeAppInfo = styled(Grid)`
  padding: 9px 0;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  margin-left: 16px;
`

export default SafeAppsPermissions
