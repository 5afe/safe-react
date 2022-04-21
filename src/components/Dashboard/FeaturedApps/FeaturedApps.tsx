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
  margin-top: 10px;
  text-decoration: none;
`

export const FeaturedApps = (): ReactElement => {
  const { allApps } = useAppList()
  const { address } = useSelector(currentSafe) ?? {}
  const featuredApps = useMemo(() => allApps.filter((app) => app.tags?.includes(FEATURED_APPS_TAG)), [allApps])

  const routesSlug: SafeRouteParams = {
    shortName: getShortName(),
    safeAddress: address,
  }

  return (
    <WidgetContainer>
      <WidgetTitle>Safe Apps</WidgetTitle>
      <WidgetBody>
        {featuredApps.map((app) => {
          const appRoute = getSafeAppUrl(app.url, routesSlug)
          return (
            <Card key={app.id}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item xs={12} md={3}>
                  <StyledImage src={app.iconUrl} alt={app.name} />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Box mb={1}>
                    <Text size="xl">{app.description}</Text>
                  </Box>
                  <StyledLink to={appRoute}>
                    <Text color="primary" size="lg" strong>
                      Use {app.name}
                    </Text>
                  </StyledLink>
                </Grid>
              </Grid>
            </Card>
          )
        })}
      </WidgetBody>
    </WidgetContainer>
  )
}
