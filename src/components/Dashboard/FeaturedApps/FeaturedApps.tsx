import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { Text } from '@gnosis.pm/safe-react-components'
import { Link } from 'react-router-dom'
import { getSafeAppUrl, SafeRouteParams } from 'src/routes/routes'
import { useSelector } from 'react-redux'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { getShortName } from 'src/config'
import { ReactElement, useMemo } from 'react'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import styled from 'styled-components'
import { Card, WidgetBody, WidgetContainer, WidgetTitle } from 'src/components/Dashboard/styled'

const FEATURED_APPS_TAGS = 'dashboard-widgets'

const StyledImage = styled.img`
  width: 64px;
  height: 64px;
`

const StyledLink = styled(Link)`
  margin-top: 10px;
  text-decoration: none;
`

const StyledRow = styled(Row)`
  gap: 24px;
  flex-wrap: inherit;
  align-items: center;
`

export const FeaturedApps = (): ReactElement => {
  const { allApps } = useAppList()
  const { address } = useSelector(currentSafe) ?? {}
  const featuredApps = useMemo(() => allApps.filter((app) => app.tags?.includes(FEATURED_APPS_TAGS)), [allApps])

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
              <StyledRow>
                <Col xs={2}>
                  <StyledImage src={app.iconUrl} alt={app.name} />
                </Col>
                <Col xs={10} layout="column">
                  <Text size="xl">{app.description}</Text>
                  <StyledLink to={appRoute}>
                    <Text color="primary" size="lg" strong>
                      Use {app.name}
                    </Text>
                  </StyledLink>
                </Col>
              </StyledRow>
            </Card>
          )
        })}
      </WidgetBody>
    </WidgetContainer>
  )
}
