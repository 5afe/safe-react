import { ReactElement, useMemo } from 'react'
import Block from 'src/components/layout/Block'
import styled from 'styled-components'
import { grey400, lg } from 'src/theme/variables'
import Heading from 'src/components/layout/Heading'
import { useSafePermissions, useBrowserPermissions } from 'src/routes/safe/components/Apps/hooks/permissions'
import { Box, Grid, Link } from '@material-ui/core'
import { Checkbox, Text } from '@gnosis.pm/safe-react-components'
import { AllowedFeatures, PermissionStatus } from '../../Apps/types'

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
    updateSafePermission(origin, capability, checked)

  const handleBrowserPermissionsChange = (origin: string, feature: AllowedFeatures, checked: boolean) =>
    updateBrowserPermission(origin, feature, checked)

  return (
    <StyledContainer>
      <Heading tag="h2">Safe Apps Permissions</Heading>
      <Box flexDirection="column">
        {domains.map((domain) => (
          <StyledPermissionsCard item key={domain}>
            <StyledPermissionsCardBody container direction="row" alignItems="center">
              <Grid item>
                <Text size="lg">{domain}</Text>
              </Grid>
              {safePermissions[domain]?.map(({ parentCapability, caveats }) => {
                return (
                  <Grid item key={parentCapability}>
                    <Checkbox
                      name={parentCapability}
                      checked={!isUserRestricted(caveats)}
                      onChange={(_, checked) => handleSafePermissionsChange(domain, parentCapability, checked)}
                      label={parentCapability}
                    />
                  </Grid>
                )
              })}
              {browserPermissions[domain]?.map(({ feature, status }) => {
                return (
                  <Grid item key={feature}>
                    <Checkbox
                      name={feature.toString()}
                      checked={status === PermissionStatus.GRANTED ? true : false}
                      onChange={(_, checked) => handleBrowserPermissionsChange(domain, feature, checked)}
                      label={feature}
                    />
                  </Grid>
                )
              })}
            </StyledPermissionsCardBody>
            <StyledPermissionsCardFooter item>
              <Link href={`https://${domain}`} target="_blank">
                Allow all
              </Link>
              <Link href={`https://${domain}`} target="_blank">
                Clear all
              </Link>
            </StyledPermissionsCardFooter>
          </StyledPermissionsCard>
        ))}
      </Box>
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
  padding: 24px;
  border-bottom: 2px solid ${grey400};
`

const StyledPermissionsCardFooter = styled(Grid)`
  padding: 12px;
`

export default SafeAppsPermissions
