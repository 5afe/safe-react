export enum SAFE_APP_LOADING_STATUS {
  ADDED = 'ADDED',
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
  isDeletable?: boolean
  description: string
  error: boolean
  loadingStatus: SAFE_APP_LOADING_STATUS
}

export type StoredSafeApp = {
  url: string
  disabled?: boolean
}
