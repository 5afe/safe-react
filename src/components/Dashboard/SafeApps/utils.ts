export type TrackedSafeApps = Record<string, TrackedSafeApp>

export type TrackedSafeApp = {
  timestamp: number
  txCount: number
  openCount: number
}

const TXCOUNT_WEIGHT = 2
const OPENCOUNT_WEIGHT = 1
const MORE_RECENT_MULTIPLIER = 2
const LESS_RECENT_MULTIPLIER = 1

export const rankTrackedSafeApps = (apps: TrackedSafeApps): string[] => {
  const appsMap = Object.entries(apps)

  return appsMap
    .sort((a, b) => {
      const aTimeMultiplier = a[1].timestamp - b[1].timestamp > 0 ? MORE_RECENT_MULTIPLIER : LESS_RECENT_MULTIPLIER
      const bTimeMultiplier = b[1].timestamp - a[1].timestamp > 0 ? MORE_RECENT_MULTIPLIER : LESS_RECENT_MULTIPLIER

      const aScore = (TXCOUNT_WEIGHT * a[1].txCount + OPENCOUNT_WEIGHT * a[1].openCount) * aTimeMultiplier
      const bScore = (TXCOUNT_WEIGHT * b[1].txCount + OPENCOUNT_WEIGHT * b[1].openCount) * bTimeMultiplier

      return bScore - aScore
    })
    .map((values) => values[0])
}
