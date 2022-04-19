import { ReactElement, useMemo } from 'react'
import styled from 'styled-components'
import { Button } from '@gnosis.pm/safe-react-components'
import { generatePath, Link } from 'react-router-dom'
import Skeleton from '@material-ui/lab/Skeleton/Skeleton'
import { Grid } from '@material-ui/core'

import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { GENERIC_APPS_ROUTE } from 'src/routes/routes'
import Card, { CARD_HEIGHT, CARD_PADDING, CARD_WIDTH } from 'src/components/Dashboard/SafeApps/Card'
import ExploreIcon from 'src/assets/icons/explore.svg'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { getAppsUsageData, rankTrackedSafeApps } from 'src/routes/safe/components/Apps/trackAppUsageCount'

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

// Transactions Builder && Wallet connect
const featuredAppsId = ['29', '11']

const getRandomApps = (nonRankedApps: SafeApp[], size: number) => {
  const randomIndexes: string[] = []
  for (let i = 1; randomIndexes.length < size; i++) {
    const randomAppIndex = Math.floor(Math.random() * nonRankedApps.length).toString()
    const randomAppId = nonRankedApps[randomAppIndex].id

    // Do not repeat random apps or featured apps
    if (!randomIndexes.includes(randomAppIndex) && !featuredAppsId.includes(randomAppId)) {
      randomIndexes.push(randomAppIndex)
    }
  }

  const randomSafeApps: SafeApp[] = []
  randomIndexes.forEach((index) => {
    randomSafeApps.push(nonRankedApps[index])
  })

  return randomSafeApps
}

const SafeAppsGrid = ({ size = 6 }: { size?: number }): ReactElement => {
  const { allApps, pinnedSafeApps, togglePin, isLoading } = useAppList()

  const displayedApps = useMemo(() => {
    if (!allApps.length) return []
    const trackData = getAppsUsageData()
    const rankedSafeAppIds = rankTrackedSafeApps(trackData)

    const topRankedSafeApps: SafeApp[] = []
    rankedSafeAppIds.forEach((id) => {
      const sortedApp = allApps.find((app) => app.id === id)
      if (sortedApp) topRankedSafeApps.push(sortedApp)
    })

    const nonRankedApps = allApps.filter((app) => !rankedSafeAppIds.includes(app.id))
    // Get random apps that are not ranked
    const randomApps = getRandomApps(nonRankedApps, size - 1 - rankedSafeAppIds.length)

    // Display size - 1 in order to always display the "Explore Safe Apps" card
    return topRankedSafeApps.concat(randomApps).slice(0, size - 1)
  }, [allApps, size])

  const path = generatePath(GENERIC_APPS_ROUTE)

  return isLoading ? (
    <Grid container>
      {Array.from(Array(size).keys()).map((key) => (
        <Grid item xs={12} md={4} key={key}>
          <SkeletonWrapper>
            <Skeleton variant="rect" width={CARD_WIDTH + 2 * CARD_PADDING} height={CARD_HEIGHT + 2 * CARD_PADDING} />
          </SkeletonWrapper>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Grid container spacing={3}>
      {displayedApps.map((safeApp, idx) => (
        <Grid item xs={12} md={4} key={idx}>
          <Card
            key={safeApp.id}
            name={safeApp.name}
            description={safeApp.description}
            logoUri={safeApp.iconUrl}
            appUri={safeApp.url}
            isPinned={pinnedSafeApps.some((app) => app.id === safeApp.id)}
            onPin={() => togglePin(safeApp)}
          />
        </Grid>
      ))}
      <Grid item xs={12} md={4}>
        <StyledExplorerButton>
          <img alt="Explore Safe Apps" src={ExploreIcon} />
          <StyledLink to={path}>
            <Button size="md" color="primary" variant="contained">
              Explore Safe Apps
            </Button>
          </StyledLink>
        </StyledExplorerButton>
      </Grid>
    </Grid>
  )
}

export default SafeAppsGrid
