export type SafeApp = {
  id: string | undefined
  url: string
  name: string
  iconUrl: string
  disabled?: boolean
  error: boolean
}

export type StoredSafeApp = {
  url: string
  disabled?: boolean
}
