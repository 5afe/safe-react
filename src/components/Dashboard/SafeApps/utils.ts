import { AppTrackData } from 'src/routes/safe/components/Apps/types'

const TXCOUNT_WEIGHT = 2
const OPENCOUNT_WEIGHT = 1
const MORE_RECENT_MULTIPLIER = 2
const LESS_RECENT_MULTIPLIER = 1

export const rankTrackedSafeApps = (apps: AppTrackData): string[] => {
  const appsMap = Object.entries(apps)

  return appsMap
    .sort((a, b) => {
      const aTimeMultiplier =
        a[1].timestamp.valueOf() - b[1].timestamp.valueOf() > 0 ? MORE_RECENT_MULTIPLIER : LESS_RECENT_MULTIPLIER
      const bTimeMultiplier =
        b[1].timestamp.valueOf() - a[1].timestamp.valueOf() > 0 ? MORE_RECENT_MULTIPLIER : LESS_RECENT_MULTIPLIER

      const aScore = (TXCOUNT_WEIGHT * a[1].txCount + OPENCOUNT_WEIGHT * a[1].openCount) * aTimeMultiplier
      const bScore = (TXCOUNT_WEIGHT * b[1].txCount + OPENCOUNT_WEIGHT * b[1].openCount) * bTimeMultiplier

      return bScore - aScore
    })
    .map((values) => values[0])
}
