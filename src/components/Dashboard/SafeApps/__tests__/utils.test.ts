import { rankTrackedSafeApps } from 'src/components/Dashboard/SafeApps/utils'
import { AppTrackData } from 'src/routes/safe/components/Apps/types'

describe('rankTrackedSafeApps', () => {
  it('ranks more recent apps higher', () => {
    const trackedSafeApps: AppTrackData = {
      '1': {
        timestamp: new Date(1),
        txCount: 1,
        openCount: 1,
      },
      '2': {
        timestamp: new Date(3),
        txCount: 1,
        openCount: 1,
      },
      '3': {
        timestamp: new Date(5),
        txCount: 1,
        openCount: 1,
      },
      '4': {
        timestamp: new Date(2),
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
        timestamp: new Date(1),
        txCount: 1,
        openCount: 1,
      },
      '2': {
        timestamp: new Date(4),
        txCount: 4,
        openCount: 6,
      },
      '3': {
        timestamp: new Date(8),
        txCount: 3,
        openCount: 4,
      },
      '4': {
        timestamp: new Date(5),
        txCount: 2,
        openCount: 2,
      },
    }
    const result = rankTrackedSafeApps(trackedSafeApps)
    expect(result).toEqual(['3', '2', '4', '1'])
  })
})
