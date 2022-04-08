import { SafeAppData } from '@gnosis.pm/safe-react-gateway-sdk'
import { FETCH_STATUS } from 'src/utils/requests'

export type SafeApp = Omit<SafeAppData, 'id'> & {
  id: string
  disabled?: boolean
  fetchStatus: FETCH_STATUS
  custom?: boolean
}

export type StoredSafeApp = {
  url: string
}

export type AppTrackData = {
  [safeAppId: string]: {
    timestamp: number
    openCount: number
    txCount: number
  }
}
