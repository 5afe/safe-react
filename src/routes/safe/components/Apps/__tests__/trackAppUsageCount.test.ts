import { AppTrackData, rankSafeApps } from 'src/routes/safe/components/Apps/trackAppUsageCount'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { SafeAppAccessPolicyTypes } from '@gnosis.pm/safe-react-gateway-sdk'
import { FETCH_STATUS } from 'src/utils/requests'

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
    const result = rankSafeApps(trackedSafeApps, [])
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
        txCount: 4,
        openCount: 4,
      },
      '4': {
        timestamp: 5,
        txCount: 2,
        openCount: 2,
      },
    }
    const result = rankSafeApps(trackedSafeApps, [])
    expect(result).toEqual(['3', '2', '4', '1'])
  })

  it('includes pinned apps in ranking', () => {
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

    const pinnedApps: SafeApp[] = [
      {
        id: '5',
        url: '',
        name: '',
        iconUrl: '',
        description: '',
        chainIds: ['1'],
        provider: undefined,
        accessControl: {
          type: SafeAppAccessPolicyTypes.DomainAllowlist,
          value: [],
        },
        fetchStatus: FETCH_STATUS.SUCCESS,
        tags: [],
      },
    ]

    const result = rankSafeApps(trackedSafeApps, pinnedApps)
    expect(result).toEqual(['2', '3', '5', '4', '1'])
  })
})
