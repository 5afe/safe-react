import { useCallback, useEffect, useState } from 'react'

import { WidgetType } from 'src/components/Dashboard/SafeWidget/SafeWidget'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const overviewSafeWidget: WidgetType = {
  widgetId: '0',
  widgetType: 'overviewSafeWidget',
  widgetLayout: {
    column: 0, // x
    row: 0, // y
    width: 6, // w
    minW: 6,
    height: 12, // h
    minH: 12,
  },
}

const gasPriceWidget: WidgetType = {
  widgetId: '1',
  widgetType: 'gasPriceWidget',
  widgetEndointUrl:
    'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=W7N7ISIDY1JFPYUI2D2HWVMMD3RF88QCCD',
  pollingTime: 14000,
  widgetLayout: {
    column: 8, // x
    row: 0, // y
    width: 2, // w
    height: 6, // h
    minW: 2,
    minH: 6,
  },
}

const claimCowTokens: WidgetType = {
  widgetId: '2',
  widgetType: 'claimTokensWidget',
  widgetEndointUrl: 'http://localhost:3001/api',
  widgetLayout: {
    column: 6, // x
    row: 0, // y
    width: 2, // w
    height: 9, // h
    minW: 2,
    minH: 9,
  },
  widgetProps: {
    iconUrl: 'https://cowswap.exchange/static/media/cow_v2.00b93700.svg',
    tokenName: 'CoW Protocol Token',
    tokenSymbol: 'COW',
    tokenAddress: '0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB',
  },
}

const claimSafeTokens: WidgetType = {
  widgetId: '3',
  widgetType: 'claimTokensWidget',
  widgetEndointUrl: 'http://localhost:3002/api',
  widgetLayout: {
    column: 10, // x
    row: 0, // y
    width: 2, // w
    height: 9, // h
    minW: 2,
    minH: 9,
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
  widgetId: '4',
  widgetType: 'iframe',
  widgetIframeUrl: 'https://cowswap.exchange/?widget=1',
  widgetLayout: {
    row: 12, // y
    column: 0, // x
    width: 4, // w
    height: 43, // h
    minH: 43,
  },
}

const uniSwapWidget: WidgetType = {
  widgetId: '5',
  widgetType: 'iframe',
  widgetIframeUrl: 'https://app.uniswap.org',
  widgetLayout: {
    row: 12, // y
    column: 4, // x
    width: 4, // w
    height: 24, // h
    minH: 24,
  },
}

const rampWidget: WidgetType = {
  widgetId: '6',
  widgetType: 'iframe',
  widgetIframeUrl: 'https://apps.gnosis-safe.io/ramp-network',
  widgetLayout: {
    row: 12, // y
    column: 8, // x
    width: 4, // w
    height: 30, // h
    minH: 30,
  },
}

const defaultWidgets: WidgetType[] = [
  overviewSafeWidget,
  gasPriceWidget,
  claimCowTokens,
  claimSafeTokens,
  cowSwapWidget,
  uniSwapWidget,
  rampWidget,
]

const SAFE_WIDGETS = 'SAFE_WIDGETS'

type ReturnType = {
  widgets: WidgetType[]
  updateWidgets: (newWidgets: WidgetType[]) => void
}

const useSafeWidgets = (): ReturnType => {
  const [widgets, setWidgets] = useState<WidgetType[]>(defaultWidgets)

  useEffect(() => {
    const safeWidgets = loadFromStorage<WidgetType[]>(SAFE_WIDGETS) || defaultWidgets
    setWidgets([...safeWidgets])
  }, [])

  const updateWidgets = useCallback((newWidgets: WidgetType[]) => {
    setWidgets([...newWidgets])
    saveToStorage(SAFE_WIDGETS, newWidgets)
  }, [])

  return {
    widgets,
    updateWidgets,
  }
}

export default useSafeWidgets
