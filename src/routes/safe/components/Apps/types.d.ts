export type SafeApp = {
  id: string | undefined
  url: string
  name: string
  iconUrl: string
  disabled?: boolean
  isDeletable?: boolean
  error: boolean
  description: string
}

export type StoredSafeApp = {
  url: string
  disabled?: boolean
}
