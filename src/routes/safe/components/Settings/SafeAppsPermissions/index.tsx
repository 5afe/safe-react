import { ReactElement, useMemo } from 'react'
import Block from 'src/components/layout/Block'
import styled from 'styled-components'
import { lg } from 'src/theme/variables'
import Heading from 'src/components/layout/Heading'
import { useSafePermissions } from 'src/routes/safe/components/Apps/hooks/permissions/useSafePermissions'
import { useBrowserPermissions } from 'src/routes/safe/components/Apps/hooks/permissions/useBrowserPermissions'
import { Box } from '@material-ui/core'
import { Checkbox, Text, Accordion, AccordionSummary, AccordionDetails } from '@gnosis.pm/safe-react-components'
import { AllowedFeatures, PermissionStatus } from '../../Apps/types'

const SafeAppsPermissions = (): ReactElement => {
  const { permissions: safePermissions, updateSafePermission, isUserRestricted } = useSafePermissions()
  const { permissions: browserPermissions, updateBrowserPermission } = useBrowserPermissions()

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
    <Container>
      <Heading tag="h2">Safe Apps Permissions</Heading>
      <Box mt={2}>
        {domains.map((domain) => (
          <Accordion compact key={domain}>
            <AccordionSummary>
              <Text size="lg">{domain}</Text>
            </AccordionSummary>
            <AccordionDetails>
              {safePermissions[domain]?.map(({ parentCapability, caveats }) => {
                return (
                  <Checkbox
                    key={parentCapability}
                    name={parentCapability}
                    checked={!isUserRestricted(caveats)}
                    onChange={(_, checked) => handleSafePermissionsChange(domain, parentCapability, checked)}
                    label={parentCapability}
                  />
                )
              })}
              {browserPermissions[domain]?.map(({ feature, status }) => {
                return (
                  <Checkbox
                    key={feature}
                    name={feature.toString()}
                    checked={status === PermissionStatus.GRANTED ? true : false}
                    onChange={(_, checked) => handleBrowserPermissionsChange(domain, feature, checked)}
                    label={feature}
                  />
                )
              })}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  )
}

const Container = styled(Block)`
  padding: ${lg};
`

export default SafeAppsPermissions
