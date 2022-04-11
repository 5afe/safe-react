import { AppTrackData } from 'src/routes/safe/components/Apps/trackAppUsageCount'

const TX_COUNT_WEIGHT = 2
const OPEN_COUNT_WEIGHT = 1
const MORE_RECENT_MULTIPLIER = 2
const LESS_RECENT_MULTIPLIER = 1

export const rankTrackedSafeApps = (apps: AppTrackData): string[] => {
  const appsMap = Object.entries(apps)

  return appsMap
    .sort((a, b) => {
      // The more recently used app gets a bigger score/relevancy multiplier
      const aTimeMultiplier =
        a[1].timestamp.valueOf() - b[1].timestamp.valueOf() > 0 ? MORE_RECENT_MULTIPLIER : LESS_RECENT_MULTIPLIER
      const bTimeMultiplier =
        b[1].timestamp.valueOf() - a[1].timestamp.valueOf() > 0 ? MORE_RECENT_MULTIPLIER : LESS_RECENT_MULTIPLIER

      // The sorting score is a weighted function where the OPEN_C0UNT weights differently than the TX_COUNT
      const aScore = (TX_COUNT_WEIGHT * a[1].txCount + OPEN_COUNT_WEIGHT * a[1].openCount) * aTimeMultiplier
      const bScore = (TX_COUNT_WEIGHT * b[1].txCount + OPEN_COUNT_WEIGHT * b[1].openCount) * bTimeMultiplier

      return bScore - aScore
    })
    .map((values) => values[0])
}
