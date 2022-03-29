import { ReactElement } from 'react'
import styled from 'styled-components'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import Card from './Card'

const StyledGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const Grid = (): ReactElement => {
  const { pinnedSafeApps, togglePin } = useAppList()

  return (
    <div>
      <h2>Safe Apps</h2>

      <StyledGrid>
        {pinnedSafeApps.map((safeApp) => (
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
