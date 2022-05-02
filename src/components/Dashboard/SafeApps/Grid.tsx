import { ReactElement, useMemo } from 'react'
import styled from 'styled-components'
import { Button } from '@gnosis.pm/safe-react-components'
import { generatePath, Link } from 'react-router-dom'
import Skeleton from '@material-ui/lab/Skeleton/Skeleton'
import { Grid } from '@material-ui/core'
import { sampleSize, uniqBy } from 'lodash'

import { screenSm, screenMd } from 'src/theme/variables'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { GENERIC_APPS_ROUTE } from 'src/routes/routes'
import Card, { CARD_HEIGHT, CARD_PADDING } from 'src/components/Dashboard/SafeApps/Card'
import ExploreIcon from 'src/assets/icons/explore.svg'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { getAppsUsageData, rankTrackedSafeApps } from 'src/routes/safe/components/Apps/trackAppUsageCount'
import { FEATURED_APPS_TAG } from 'src/components/Dashboard/FeaturedApps/FeaturedApps'
import { WidgetTitle, WidgetBody, WidgetContainer } from 'src/components/Dashboard/styled'

const SkeletonWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
`

const StyledExplorerButton = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const StyledLink = styled(Link)`
  text-decoration: none;

  > button {
    width: 200px;
  }
`

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: ${screenMd}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${screenSm}px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`

const useRankedApps = (allApps: SafeApp[], pinnedSafeApps: SafeApp[], size: number): SafeApp[] => {
  return useMemo(() => {
    if (!allApps.length) return []

    const trackData = getAppsUsageData()
    const rankedSafeAppIds = rankTrackedSafeApps(trackData)
    const featuredSafeAppIds = allApps.filter((app) => app.tags?.includes(FEATURED_APPS_TAG)).map((app) => app.id)

    const nonFeaturedApps = allApps.filter((app) => !featuredSafeAppIds.includes(app.id))
    const nonRankedApps = nonFeaturedApps.filter((app) => !rankedSafeAppIds.includes(app.id))

    const topRankedSafeApps: SafeApp[] = []
    rankedSafeAppIds.forEach((id) => {
      const sortedApp = nonFeaturedApps.find((app) => app.id === id)
      if (sortedApp) topRankedSafeApps.push(sortedApp)
    })

    // Get random apps that are not ranked and not featured
    const randomApps = sampleSize(nonRankedApps, size - 1 - topRankedSafeApps.length)

    const resultApps = uniqBy(topRankedSafeApps.concat(pinnedSafeApps, randomApps), 'id')

    // Display size - 1 in order to always display the "Explore Safe Apps" card
    return resultApps.slice(0, size - 1)
  }, [allApps, pinnedSafeApps, size])
}

const SafeAppsGrid = ({ size = 6 }: { size?: number }): ReactElement => {
  const { allApps, pinnedSafeApps, isLoading, togglePin } = useAppList()
  const displayedApps = useRankedApps(allApps, pinnedSafeApps, size)

  const path = generatePath(GENERIC_APPS_ROUTE)

  const LoadingState = useMemo(
    () => (
      <Grid container spacing={3}>
        {Array.from(Array(size).keys()).map((key) => (
          <Grid item xs={12} md={4} key={key}>
            <SkeletonWrapper>
              <Skeleton variant="rect" height={CARD_HEIGHT + 2 * CARD_PADDING} />
            </SkeletonWrapper>
          </Grid>
        ))}
      </Grid>
    ),
    [size],
  )

  if (isLoading) return LoadingState

  return (
    <WidgetContainer>
      <WidgetTitle>Safe Apps</WidgetTitle>
      <WidgetBody>
        <StyledGrid>
          {displayedApps.map((safeApp) => (
            <Card
              key={safeApp.id}
              name={safeApp.name}
              description={safeApp.description}
              logoUri={safeApp.iconUrl}
              appUri={safeApp.url}
              isPinned={pinnedSafeApps.some((app) => app.id === safeApp.id)}
              onPin={() => togglePin(safeApp)}
            />
          ))}
          <StyledExplorerButton>
            <img alt="Explore Safe Apps" src={ExploreIcon} />
            <StyledLink to={path}>
              <Button size="md" color="primary" variant="contained">
                Explore Safe Apps
              </Button>
            </StyledLink>
          </StyledExplorerButton>
        </StyledGrid>
      </WidgetBody>
    </WidgetContainer>
  )
}

export default SafeAppsGrid
