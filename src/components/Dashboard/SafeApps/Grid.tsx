import { ReactElement } from 'react'
import styled from 'styled-components'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import Card from './Card'

const StyledGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const MAX_APPS = 3

const Grid = (): ReactElement => {
  const { allApps, pinnedSafeApps, togglePin } = useAppList()
  // Transactions Builder && Wallet connect
  const officialAppIds = ['29', '11']
  const officialApps = allApps.filter((app) => officialAppIds.includes(app.id))

  const displayedApps = pinnedSafeApps.concat(officialApps).slice(0, MAX_APPS)

  return (
    <div>
      <h2>Safe Apps</h2>

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
      </StyledGrid>
    </div>
  )
}

export default Grid
