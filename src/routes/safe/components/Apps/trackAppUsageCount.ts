import { SafeApp } from 'src/routes/safe/components/Apps/types'
import local from 'src/utils/storage/local'

export const APPS_DASHBOARD = 'APPS_DASHBOARD'

const TX_COUNT_WEIGHT = 2
const OPEN_COUNT_WEIGHT = 1
const MORE_RECENT_MULTIPLIER = 2
const LESS_RECENT_MULTIPLIER = 1

export type AppTrackData = {
  [safeAppId: string]: {
    timestamp: number
    openCount: number
    txCount: number
  }
}

export const getAppsUsageData = (): AppTrackData => {
  return local.getItem<AppTrackData>(APPS_DASHBOARD) || {}
}

export const trackSafeAppOpenCount = (id: SafeApp['id']): void => {
  const trackData = getAppsUsageData()
  const currentOpenCount = trackData[id]?.openCount || 0
  const currentTxCount = trackData[id]?.txCount || 0

  local.setItem(APPS_DASHBOARD, {
    ...trackData,
    [id]: {
      timestamp: Date.now(),
      openCount: currentOpenCount + 1,
      txCount: currentTxCount,
    },
  })
}

export const trackSafeAppTxCount = (id: SafeApp['id']): void => {
  const trackData = getAppsUsageData()
  const currentTxCount = trackData[id]?.txCount || 0

  local.setItem(APPS_DASHBOARD, {
    ...trackData,
    // The object contains the openCount when we are creating a transaction
    [id]: { ...trackData[id], txCount: currentTxCount + 1 },
  })
}

export const rankTrackedSafeApps = (apps: AppTrackData): string[] => {
  const appsMap = Object.entries(apps)

  return appsMap
    .sort((a, b) => {
      // The more recently used app gets a bigger score/relevancy multiplier
      const aTimeMultiplier = a[1].timestamp - b[1].timestamp > 0 ? MORE_RECENT_MULTIPLIER : LESS_RECENT_MULTIPLIER
      const bTimeMultiplier = b[1].timestamp - a[1].timestamp > 0 ? MORE_RECENT_MULTIPLIER : LESS_RECENT_MULTIPLIER

      // The sorting score is a weighted function where the OPEN_COUNT weights differently than the TX_COUNT
      const aScore = (TX_COUNT_WEIGHT * a[1].txCount + OPEN_COUNT_WEIGHT * a[1].openCount) * aTimeMultiplier
      const bScore = (TX_COUNT_WEIGHT * b[1].txCount + OPEN_COUNT_WEIGHT * b[1].openCount) * bTimeMultiplier

      return bScore - aScore
    })
    .map((values) => values[0])
}
