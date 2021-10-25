import { FETCH_STATUS } from 'src/utils/requests'

export type SafeApp = {
  id: string
  url: string
  name: string
  iconUrl: string
  disabled?: boolean
  description: string
  fetchStatus: FETCH_STATUS
  custom?: boolean
}

export type StoredSafeApp = {
  url: string
}
