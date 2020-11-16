export enum SAFE_APP_FETCH_STATUS {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type SafeApp = {
  id: string
  url: string
  name: string
  iconUrl: string
  disabled?: boolean
  description: string
  error: boolean
  fetchStatus: SAFE_APP_FETCH_STATUS
}

export type StoredSafeApp = {
  url: string
}
