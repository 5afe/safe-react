import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import SettingsIcon from '@material-ui/icons/Settings'
import { IconButton } from '@material-ui/core'
import RGL, { WidthProvider } from 'react-grid-layout'
import { Tooltip, Button, Card } from '@gnosis.pm/safe-react-components'

const ReactGridLayout = WidthProvider(RGL)

import { black500, extraLargeFontSize } from 'src/theme/variables'
import SafeWidget, { ROW_HEIGHT } from './SafeWidget/SafeWidget'
import useSafeWidgets from 'src/logic/hooks/useSafeWidgets'

const CustomizableDashboard = (): ReactElement => {
  const { widgets, updateWidgets } = useSafeWidgets()

  const [isEditMode, setIsEditMode] = useState(false)
  const [editedWidgets, setEditedWidgets] = useState(widgets)

  const onSaveEditDashboard = () => {
    updateWidgets(editedWidgets)
    setIsEditMode(false)
  }

  const onCancelEditDashboard = () => {
    setEditedWidgets([...widgets])
    setIsEditMode(false)
  }

  const onLayoutChange = (layouts) => {
    const newWidgets = editedWidgets.map((currentWidget) => {
      const layout = layouts.find(({ i }) => i === currentWidget.widgetId)
      return {
        ...currentWidget,
        widgetLayout: {
          row: layout.y,
          column: layout.x,
          width: layout.w,
          height: layout.h,
        },
      }
    })

    setEditedWidgets(newWidgets)
  }

  return (
    <StyledGridContainer>
      <DashboardHeader>
        <DashboardTitle>customizable Dashboard POC</DashboardTitle>

        {!isEditMode && (
          <Tooltip placement="top" title="Customize your dashboard!" backgroundColor="primary" textColor="white" arrow>
            <StyledIcon onClick={() => setIsEditMode(true)}>
              <SettingsIcon />
            </StyledIcon>
          </Tooltip>
        )}
      </DashboardHeader>
      {isEditMode && (
        <>
          <WidgetCatalog>Widget Catalog</WidgetCatalog>
          <StyledBtn size={'md'} onClick={onSaveEditDashboard}>
            Save
          </StyledBtn>
          <StyledBtn color={'secondary'} variant="bordered" size={'md'} onClick={onCancelEditDashboard}>
            Cancel
          </StyledBtn>
        </>
      )}
      <ReactGridLayout
        // TODO: Add responsive
        // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        onLayoutChange={onLayoutChange}
        key={isEditMode}
        cols={12}
        rowHeight={ROW_HEIGHT}
        compactType={'horizontal'}
        layout={widgets.map((widget) => ({
          i: widget.widgetId,
          x: widget.widgetLayout.column,
          y: widget.widgetLayout.row,
          w: widget.widgetLayout.width,
          h: widget.widgetLayout.height,
        }))}
        isDraggable={isEditMode}
        isResizable={isEditMode}
      >
        {widgets.map((widget) => {
          return (
            <div key={widget.widgetId}>
              <SafeWidget widget={widget} isEditWidgetEnabled={isEditMode} />
            </div>
          )
        })}
      </ReactGridLayout>
    </StyledGridContainer>
  )
}

export default CustomizableDashboard

const StyledGridContainer = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 12px;
`

const StyledIcon = styled(IconButton)`
  height: 42px;
  width: 42px;
`

export const DashboardTitle = styled.h1`
  color: ${black500};
  font-size: ${extraLargeFontSize};
`

const WidgetCatalog = styled(Card)`
  margin: 8px;
`

const StyledBtn = styled(Button)`
  margin-left: 8px;
`
