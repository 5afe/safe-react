import { ReactElement, useMemo } from 'react'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { Text } from '@gnosis.pm/safe-react-components'
import { Link } from 'react-router-dom'
import { Box, Grid } from '@material-ui/core'

import styled from 'styled-components'
import { getSafeAppUrl, SafeRouteParams } from 'src/routes/routes'
import { Card, WidgetBody, WidgetContainer, WidgetTitle } from 'src/components/Dashboard/styled'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

export const FEATURED_APPS_TAG = 'dashboard-widgets'

const StyledImage = styled.img`
  width: 64px;
  height: 64px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const StyledGrid = styled(Grid)`
  gap: 24px;
`

const StyledGridItem = styled(Grid)`
  min-width: 300px;
`

export const FeaturedApps = (): ReactElement | null => {
  const { allApps, isLoading } = useAppList()

  const { shortName, safeAddress } = useSafeAddress()
  const featuredApps = useMemo(() => allApps.filter((app) => app.tags?.includes(FEATURED_APPS_TAG)), [allApps])

  const routesSlug: SafeRouteParams = {
    shortName,
    safeAddress,
  }

  if (!featuredApps.length && !isLoading) return null

  return (
    <Grid item xs={12} md>
      <WidgetContainer id="featured-safe-apps">
        <WidgetTitle>Connect & Transact</WidgetTitle>
        <WidgetBody>
          <StyledGrid container>
            {featuredApps.map((app) => (
              <StyledGridItem item xs md key={app.id}>
                <StyledLink to={getSafeAppUrl(app.url, routesSlug)}>
                  <Card>
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
                  </Card>
                </StyledLink>
              </StyledGridItem>
            ))}
          </StyledGrid>
        </WidgetBody>
      </WidgetContainer>
    </Grid>
  )
}
