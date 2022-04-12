import { ReactElement, useMemo } from 'react'
import styled from 'styled-components'
import { Button } from '@gnosis.pm/safe-react-components'
import { generatePath, Link } from 'react-router-dom'
import Skeleton from '@material-ui/lab/Skeleton/Skeleton'

import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { GENERIC_APPS_ROUTE } from 'src/routes/routes'
import Card, { CARD_HEIGHT, CARD_PADDING, CARD_WIDTH } from 'src/components/Dashboard/SafeApps/Card'
import ExploreIcon from 'src/assets/icons/explore.svg'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { getAppsUsageData, rankTrackedSafeApps } from 'src/routes/safe/components/Apps/trackAppUsageCount'

const StyledGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`

const SkeletonWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
`

const StyledExplorerButton = styled.div`
  width: 260px;
  height: 200px;
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
const officialAppIds = ['29', '11']

const Grid = ({ size = 3 }: { size?: number }): ReactElement => {
  const { allApps, pinnedSafeApps, togglePin, isLoading } = useAppList()

  const displayedApps = useMemo(() => {
    const trackData = getAppsUsageData()
    const rankedSafeAppIds = rankTrackedSafeApps(trackData)

    const topRankedSafeApps: SafeApp[] = []
    rankedSafeAppIds.forEach((id) => {
      const sortedApp = allApps.find((app) => app.id === id)
      if (sortedApp) topRankedSafeApps.push(sortedApp)
    })

    // Do not repeat top ranked apps
    const officialApps = allApps.filter((app) => officialAppIds.includes(app.id) && !rankedSafeAppIds.includes(app.id))

    // Display size - 1 in order to always display the "Explore Safe Apps" card
    return topRankedSafeApps.concat(officialApps).slice(0, size - 1)
  }, [allApps, size])

  const path = generatePath(GENERIC_APPS_ROUTE)

  return (
    <div>
      <h2>Safe Apps</h2>
      {isLoading ? (
        <StyledGrid>
          {Array.from(Array(size).keys()).map((key) => (
            <SkeletonWrapper key={key}>
              <Skeleton variant="rect" width={CARD_WIDTH + 2 * CARD_PADDING} height={CARD_HEIGHT + 2 * CARD_PADDING} />
            </SkeletonWrapper>
          ))}
        </StyledGrid>
      ) : (
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
      )}
    </div>
  )
}

export default Grid
