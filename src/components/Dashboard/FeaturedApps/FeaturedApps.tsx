import { ReactElement, useMemo } from 'react'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { Text } from '@gnosis.pm/safe-react-components'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Grid } from '@material-ui/core'

import styled from 'styled-components'
import { getSafeAppUrl, SafeRouteParams } from 'src/routes/routes'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { getShortName } from 'src/config'
import { Card, WidgetBody, WidgetContainer, WidgetTitle } from 'src/components/Dashboard/styled'

export const FEATURED_APPS_TAG = 'dashboard-widgets'

const StyledImage = styled.img`
  width: 64px;
  height: 64px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

export const FeaturedApps = (): ReactElement | null => {
  const { allApps, isLoading } = useAppList()
  const { address } = useSelector(currentSafe) ?? {}
  const featuredApps = useMemo(() => allApps.filter((app) => app.tags?.includes(FEATURED_APPS_TAG)), [allApps])

  const routesSlug: SafeRouteParams = {
    shortName: getShortName(),
    safeAddress: address,
  }

  if (!featuredApps.length && !isLoading) return null

  return (
    <Grid item xs={12} md={6}>
      <WidgetContainer>
        <WidgetTitle>Connect & Transact</WidgetTitle>
        <WidgetBody>
          {featuredApps.map((app) => {
            const appRoute = getSafeAppUrl(app.url, routesSlug)
            return (
              <Card key={app.id}>
                <StyledLink to={appRoute}>
                  <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={12} md={3}>
                      <StyledImage src={app.iconUrl} alt={app.name} />
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Box mb={1.01}>
                        <Text size="xl">{app.description}</Text>
                      </Box>
                      <Text color="primary" size="lg" strong>
                        Use {app.name}
                      </Text>
                    </Grid>
                  </Grid>
                </StyledLink>
              </Card>
            )
          })}
        </WidgetBody>
      </WidgetContainer>
    </Grid>
  )
}
