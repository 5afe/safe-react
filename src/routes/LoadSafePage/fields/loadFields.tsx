export const FIELD_LOAD_CUSTOM_SAFE_NAME = 'customSafeName'
export const FIELD_LOAD_SUGGESTED_SAFE_NAME = 'suggestedSafeName'
export const FIELD_LOAD_SAFE_ADDRESS = 'safeAddress'
export const FIELD_LOAD_IS_LOADING_SAFE_ADDRESS = 'isLoadingSafeAddress'
export const FIELD_SAFE_OWNER_LIST = 'safeOwnerList'
export const FIELD_SAFE_THRESHOLD = 'safeThreshold'

export type OwnerFieldListItem = {
  address: string
  name: string
}

export type LoadSafeFormValues = {
  [FIELD_LOAD_CUSTOM_SAFE_NAME]?: string
  [FIELD_LOAD_SUGGESTED_SAFE_NAME]: string
  [FIELD_LOAD_SAFE_ADDRESS]?: string
  [FIELD_LOAD_IS_LOADING_SAFE_ADDRESS]: boolean
  [FIELD_SAFE_OWNER_LIST]: Array<OwnerFieldListItem>
  [FIELD_SAFE_THRESHOLD]?: number
}
