import { AppTrackData, rankTrackedSafeApps } from 'src/routes/safe/components/Apps/trackAppUsageCount'

describe('rankTrackedSafeApps', () => {
  it('ranks more recent apps higher', () => {
    const trackedSafeApps: AppTrackData = {
      '1': {
        timestamp: 1,
        txCount: 1,
        openCount: 1,
      },
      '2': {
        timestamp: 3,
        txCount: 1,
        openCount: 1,
      },
      '3': {
        timestamp: 5,
        txCount: 1,
        openCount: 1,
      },
      '4': {
        timestamp: 2,
        txCount: 1,
        openCount: 1,
      },
    }
    const result = rankTrackedSafeApps(trackedSafeApps)
    expect(result).toEqual(['3', '2', '4', '1'])
  })

  it('ranks apps by relevancy', () => {
    const trackedSafeApps: AppTrackData = {
      '1': {
        timestamp: 1,
        txCount: 1,
        openCount: 1,
      },
      '2': {
        timestamp: 4,
        txCount: 4,
        openCount: 6,
      },
      '3': {
        timestamp: 8,
        txCount: 3,
        openCount: 4,
      },
      '4': {
        timestamp: 5,
        txCount: 2,
        openCount: 2,
      },
    }
    const result = rankTrackedSafeApps(trackedSafeApps)
    expect(result).toEqual(['3', '2', '4', '1'])
  })
})
