import { ReactElement } from 'react'
import styled from 'styled-components'
import SettingsIcon from '@material-ui/icons/Settings'
import { useMediaQuery, IconButton } from '@material-ui/core'

import { black500, extraLargeFontSize } from 'src/theme/variables'
import SafeWidget, { WidgetCellType, WidgetType } from './SafeWidget/SafeWidget'

const COLUMN_CELL_SIZE = 50 // pixels
const ROW_CELL_SIZE = 50 // pixels
const WIDGET_GAP = 5 // pixels

const gasPriceWidget: WidgetType = {
  widgetId: 1,
  widgetType: 'gasPriceWidget',
  widgetEndointUrl:
    'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=W7N7ISIDY1JFPYUI2D2HWVMMD3RF88QCCD',
  pollingTime: 14000,
  desktopSize: {
    columnCells: 4,
    rowCells: 2,
  },
  mobileSize: {
    columnCells: 4,
    rowCells: 2,
  },
}

const claimCowTokens: WidgetType = {
  widgetId: 2,
  widgetType: 'claimTokensWidget',
  widgetEndointUrl: 'http://localhost:3001/api',
  desktopSize: {
    columnCells: 5,
    rowCells: 4,
  },
  mobileSize: {
    columnCells: 4,
    rowCells: 4,
  },
  widgetProps: {
    iconUrl: 'https://cowswap.exchange/static/media/cow_v2.00b93700.svg',
    tokenName: 'CoW Protocol Token',
    tokenSymbol: 'COW',
    tokenAddress: '0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB',
  },
}

const claimSafeTokens: WidgetType = {
  widgetId: 2,
  widgetType: 'claimTokensWidget',
  widgetEndointUrl: 'http://localhost:3002/api',
  desktopSize: {
    columnCells: 5,
    rowCells: 4,
  },
  mobileSize: {
    columnCells: 4,
    rowCells: 4,
  },
  widgetProps: {
    iconUrl:
      'https://safe-transaction-assets.gnosis-safe.io/tokens/logos/0x5aFE3855358E112B5647B952709E6165e1c1eEEe.png',
    tokenName: 'Safe Token',
    tokenSymbol: 'SAFE',
    tokenAddress: '0x5aFE3855358E112B5647B952709E6165e1c1eEEe',
  },
}

const cowSwapWidget: WidgetType = {
  widgetId: 3,
  widgetType: 'iframe',
  widgetIframeUrl: 'https://cowswap.exchange/',
  desktopSize: {
    columnCells: 8,
    rowCells: 16,
  },
  mobileSize: {
    columnCells: 6,
    rowCells: 10,
  },
}

const uniSwapWidget: WidgetType = {
  widgetId: 3,
  widgetType: 'iframe',
  widgetIframeUrl: 'https://app.uniswap.org',
  desktopSize: {
    columnCells: 7,
    rowCells: 10,
  },
  mobileSize: {
    columnCells: 6,
    rowCells: 9,
  },
}

const rampWidget: WidgetType = {
  widgetId: 3,
  widgetType: 'iframe',
  widgetIframeUrl: 'https://apps.gnosis-safe.io/ramp-network',
  desktopSize: {
    columnCells: 7,
    rowCells: 12,
  },
  mobileSize: {
    columnCells: 7,
    rowCells: 10,
  },
}

const widgets: WidgetType[] = [
  gasPriceWidget,
  gasPriceWidget,
  claimCowTokens,
  cowSwapWidget,
  gasPriceWidget,
  gasPriceWidget,
  uniSwapWidget,
  claimSafeTokens,
  rampWidget,
]

const CustomizableDashboard = (): ReactElement => {
  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <StyledGridContainer>
      <DashboardHeader>
        <DashboardTitle>customizable Dashboard POC</DashboardTitle>
        <StyledIcon>
          <SettingsIcon />
        </StyledIcon>
      </DashboardHeader>

      <DashboardGrid>
        {widgets.map((widget) => {
          const { rowCells, columnCells } = isMobile ? widget.mobileSize : widget.desktopSize

          return (
            <DashboardItem key={widget.widgetId} columnCells={columnCells} rowCells={rowCells}>
              <SafeWidget widget={widget} />
            </DashboardItem>
          )
        })}
      </DashboardGrid>
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

const DashboardGrid = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, ${WIDGET_GAP}px);
  grid-auto-rows: ${WIDGET_GAP}px;
`
const DashboardItem = styled.div<{ columnCells: WidgetCellType; rowCells: WidgetCellType }>`
  grid-column: span ${({ columnCells }) => columnCells * (COLUMN_CELL_SIZE / WIDGET_GAP) + 2};
  grid-row: span ${({ rowCells }) => rowCells * (ROW_CELL_SIZE / WIDGET_GAP) + 2};

  margin: ${WIDGET_GAP}px ${WIDGET_GAP}px;
  outline: 2px dashed green;
`
