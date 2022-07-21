import axios from 'axios'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getChainById } from 'src/config'
import { currentChainId } from 'src/logic/config/store/selectors'
import { currentSafeLoaded, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import GasPriceWidget from 'src/widgets/GasPriceWidget'
import ClaimTokenWidget from 'src/widgets/ClaimTokenWidget'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import { nftLoadedSelector, nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import OverviewSafeWidget from 'src/widgets/OverviewSafeWidget'

type SafeWidgetProps = {
  widget: WidgetType
}

export type WidgetCellType = DesktopCellsType | MobileCellsType

// TODO: REFINE SIZE TYPES
// width: 50px, 150px, 200px ... 500px
// heigh: 10px, 20px, ... 990px
export type DesktopCellsType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
export type MobileCellsType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// TODO: Create different types for iframeWidgetType & componentWidgetType
export type WidgetType = {
  widgetId: number
  widgetType: string
  md: {
    columnCells: DesktopCellsType
    rowCells: DesktopCellsType
  }
  xs: {
    columnCells: MobileCellsType
    rowCells: MobileCellsType
  }
  widgetIframeUrl?: string
  widgetEndointUrl?: string
  pollingTime?: number
  widgetProps?: Record<string, any>
}

export type SafeWidgetComponentProps = {
  widget: WidgetType
  // TODO: refine safeInfo type
  safeInfo: Record<string, any>
  data: Record<string, any>
  appUrl?: string
  isLoading: boolean
}

const availableWidgets = {
  overviewSafeWidget: OverviewSafeWidget,
  gasPriceWidget: GasPriceWidget,
  claimTokensWidget: ClaimTokenWidget,
  iframe: AppFrame,
}

const SafeWidget = ({ widget }: SafeWidgetProps): ReactElement => {
  const { widgetType, widgetIframeUrl, widgetEndointUrl, pollingTime } = widget

  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(!!widgetEndointUrl)

  // TODO: Refine safeInfo
  const { address, name, owners, threshold, balances } = useSelector(currentSafeWithNames)
  const chainId = useSelector(currentChainId)
  const { shortName } = getChainById(chainId)
  const loaded = useSelector(currentSafeLoaded)
  const nftTokens = useSelector(nftTokensSelector)
  const nftLoaded = useSelector(nftLoadedSelector)

  const safeInfo = {
    address,
    name,
    owners,
    threshold,
    balances,
    nftTokens,
    chain: {
      chainId,
      shortName,
    },
    loaded,
    nftLoaded,
  }

  const callEndpoint = useCallback(async () => {
    if (widgetEndointUrl) {
      // --------------- REMOVE THIS FAKE CALL

      if (widgetEndointUrl === 'http://localhost:3001/api') {
        setData({
          totalAmount: 1200,
          claimedAmount: 30,
        })
        return
      }

      if (widgetEndointUrl === 'http://localhost:3002/api') {
        setData({
          totalAmount: 3200,
          claimedAmount: 0,
        })
        return
      }

      // --------------------

      const { data } = await axios.get(widgetEndointUrl)
      setData(data)
      setIsLoading(false)
    }
  }, [widgetEndointUrl])

  // call on mount widget
  useEffect(() => {
    callEndpoint()
  }, [callEndpoint])

  // polling calls
  useEffect(() => {
    let intervalId
    if (pollingTime) {
      intervalId = setInterval(() => {
        callEndpoint()
      }, pollingTime)
    }

    return () => {
      intervalId && clearInterval(intervalId)
    }
  }, [callEndpoint, pollingTime])

  const WidgetComponent = useMemo(() => availableWidgets[widgetType], [widgetType])

  return (
    <Wrapper widgetType={widgetType}>
      <WidgetComponent
        widget={widget}
        safeInfo={safeInfo}
        data={data || {}}
        isLoading={isLoading}
        appUrl={widgetIframeUrl}
      />
    </Wrapper>
  )
}

export default SafeWidget

const Wrapper = styled.div<{ widgetType: string }>`
  height: 100%;
  width: 100%;

  ${({ widgetType }) =>
    widgetType === 'iframe' &&
    `
    padding: 0;

    && > div {
        margin: 0;
        height: 100%;
    }

    && > div > div {
        border-radius: 8px;
    } 

    && > div > div > iframe {
        border-radius: 8px;
        
    } 


  `}
`
