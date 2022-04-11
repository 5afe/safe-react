import { SafeApp } from 'src/routes/safe/components/Apps/types'
import local from 'src/utils/storage/local'

export const APPS_DASHBOARD = 'APPS_DASHBOARD'

export type AppTrackData = {
  [safeAppId: string]: {
    timestamp: number
    openCount: number
    txCount: number
  }
}

export const countOpen = (app: SafeApp): void => {
  const trackData = local.getItem<AppTrackData>(APPS_DASHBOARD) || {}
  let currentOpenCount = trackData[app.id]?.openCount
  local.setItem(APPS_DASHBOARD, {
    ...trackData,
    [app.id]: {
      ...trackData[app.id],
      timestamp: Date.now(),
      openCount: currentOpenCount ? ++currentOpenCount : 1,
      txCount: trackData[app.id]?.txCount || 0,
    },
  })
}

export const countTxs = (app: SafeApp): void => {
  const trackData = local.getItem<AppTrackData>(APPS_DASHBOARD) || {}
  let currentTxCount = trackData[app.id]?.txCount
  local.setItem(APPS_DASHBOARD, {
    ...trackData,
    [app.id]: { ...trackData[app.id], txCount: currentTxCount ? ++currentTxCount : 1 },
  })
}
