import { ReactElement, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Grid, Checkbox, FormControlLabel } from '@material-ui/core'
import { Text, Link } from '@gnosis.pm/safe-react-components'

import Block from 'src/components/layout/Block'
import { grey400, lg } from 'src/theme/variables'
import Heading from 'src/components/layout/Heading'
import { useSafePermissions, useBrowserPermissions } from 'src/routes/safe/components/Apps/hooks/permissions'
import { AllowedFeatures, PermissionStatus } from 'src/routes/safe/components/Apps/types'

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const SafeAppsPermissions = (): ReactElement => {
  const {
    permissions: safePermissions,
    updatePermission: updateSafePermission,
    isUserRestricted,
  } = useSafePermissions()
  const { permissions: browserPermissions, updatePermission: updateBrowserPermission } = useBrowserPermissions()

  const domains = useMemo(() => {
    const safePermissionsSet = new Set(Object.keys(safePermissions))
    const browserPermissionsSet = new Set(Object.keys(browserPermissions))
    const mergedPermissionsSet = new Set([...safePermissionsSet, ...browserPermissionsSet])

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

  return (
    <StyledContainer>
      <Heading tag="h2">Safe Apps Permissions</Heading>
      <br />
      {domains.map((domain) => (
        <StyledPermissionsCard item key={domain}>
          <StyledPermissionsCardBody container>
            <StyledSafeAppInfo item xs={12} sm={5}>
              <Text size="lg">{domain}</Text>
            </StyledSafeAppInfo>
            <Grid container item xs={12} sm={7}>
              {safePermissions[domain]?.map(({ parentCapability, caveats }) => {
                return (
                  <Grid key={parentCapability} item xs={12} sm={6} lg={4} xl={3}>
                    <PermissionsCheckbox
                      name={parentCapability}
                      label={parentCapability}
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
                      label={capitalize(feature.toString())}
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
          </StyledPermissionsCardFooter>
        </StyledPermissionsCard>
      ))}
    </StyledContainer>
  )
}

const PermissionsCheckbox = ({ label, checked, onChange, name }) => (
  <StyledFormControlLabel control={<Checkbox checked={checked} onChange={onChange} name={name} />} label={label} />
)

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

const StyledFormControlLabel = styled(FormControlLabel)`
  flex: 1;
  .MuiIconButton-root:not(.Mui-checked) {
    color: ${({ theme }) => theme.colors.inputDisabled};
  }
`

export default SafeAppsPermissions
