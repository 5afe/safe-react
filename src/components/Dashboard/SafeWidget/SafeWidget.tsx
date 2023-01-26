import axios from 'axios'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Tooltip, Card } from '@gnosis.pm/safe-react-components'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'

import { getChainById } from 'src/config'
import { currentChainId } from 'src/logic/config/store/selectors'
import { currentSafeLoaded, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import GasPriceWidget from 'src/widgets/GasPriceWidget'
import ClaimTokenWidget from 'src/widgets/ClaimTokenWidget'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import { nftLoadedSelector, nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import OverviewSafeWidget from 'src/widgets/OverviewSafeWidget'
import { black300 } from 'src/theme/variables'

type SafeWidgetProps = {
  widget: WidgetType
  isEditWidgetEnabled: boolean
}

export const ROW_HEIGHT = 10

type WidgetLayout = {
  column: number
  row: number

  minWidth?: number
  width: number
  maxWidth?: number

  minHeight?: number
  height: number
  maxHeight?: number
}

// TODO: Create different types for iframeWidgetType & componentWidgetType
export type WidgetType = {
  widgetId: string
  widgetType: string
  widgetLayout: WidgetLayout
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

const SafeWidget = ({ widget, isEditWidgetEnabled }: SafeWidgetProps): ReactElement => {
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
    <WidgetCard>
      {isEditWidgetEnabled && (
        <WidgetHeader>
          <Tooltip placement="top" title="Drag & Drop your widget!" backgroundColor="primary" textColor="white" arrow>
            <DragAndDropIndicatorIcon fontSize="small" />
          </Tooltip>
        </WidgetHeader>
      )}
      <WidgetBody widgetType={widgetType}>
        <WidgetComponent
          widget={widget}
          safeInfo={safeInfo}
          data={data || {}}
          isLoading={isLoading}
          appUrl={widgetIframeUrl}
        />
      </WidgetBody>
    </WidgetCard>
  )
}

export default SafeWidget

const WidgetCard = styled(Card)`
  height: 100%;
  margin-top: 0;
  padding: 0;
  position: relative;
`

const WidgetHeader = styled.div`
  position: absolute;
  padding: 8px;
  cursor: grab;
  z-index: 1000;
`

const DragAndDropIndicatorIcon = styled(DragIndicatorIcon)`
  color: ${black300};
`

const WidgetBody = styled.div<{ widgetType: string }>`
  height: 100%;
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
