import { FETCH_STATUS } from 'src/utils/requests'

export type SafeApp = {
  id: string
  url: string
  name: string
  iconUrl: string
  disabled?: boolean
  description: string
  error: boolean
  fetchStatus: FETCH_STATUS
  custom?: boolean
}

export type StoredSafeApp = {
  url: string
}
