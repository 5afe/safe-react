import { ReactElement, useMemo } from 'react'
import styled from 'styled-components'
import { Button } from '@gnosis.pm/safe-react-components'
import { generatePath, Link } from 'react-router-dom'

import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { GENERIC_APPS_ROUTE } from 'src/routes/routes'
import Card from 'src/components/Dashboard/SafeApps/Card'
import ExploreIcon from 'src/assets/icons/explore.svg'
import local from 'src/utils/storage/local'
import { AppTrackData, SafeApp } from 'src/routes/safe/components/Apps/types'
import { APPS_DASHBOARD } from 'src/routes/safe/components/Apps/utils'
import { rankTrackedSafeApps } from 'src/components/Dashboard/SafeApps/utils'

const StyledGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
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
    const trackData = local.getItem<AppTrackData>(APPS_DASHBOARD) || {}
    const rankedSafeAppIds = rankTrackedSafeApps(trackData)

    const topRankedSafeApps: SafeApp[] = []
    rankedSafeAppIds.forEach((id) => {
      const sortedApp = allApps.find((app) => app.id === id)
      if (sortedApp) topRankedSafeApps.push(sortedApp)
    })

    // Do not repeat top ranked apps
    const officialApps = allApps.filter((app) => officialAppIds.includes(app.id) && !rankedSafeAppIds.includes(app.id))
    return topRankedSafeApps.concat(officialApps).slice(0, size)
  }, [allApps, size])

  const path = generatePath(GENERIC_APPS_ROUTE)

  return (
    <div>
      <h2>Safe Apps</h2>
      {isLoading ? (
        <h2>Loading...</h2>
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
          {displayedApps.length < size && (
            <StyledExplorerButton>
              <img alt="Explore Safe Apps" src={ExploreIcon} />
              <StyledLink to={path}>
                <Button size="md" color="primary" variant="contained">
                  Explore Safe Apps
                </Button>
              </StyledLink>
            </StyledExplorerButton>
          )}
        </StyledGrid>
      )}
    </div>
  )
}

export default Grid
