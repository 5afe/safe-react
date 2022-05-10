export const FIELD_CREATE_CUSTOM_SAFE_NAME = 'customSafeName'
export const FIELD_CREATE_SUGGESTED_SAFE_NAME = 'suggestedSafeName'
export const FIELD_SAFE_OWNERS_LIST = 'owners'
export const FIELD_SAFE_OWNER_ENS_LIST = 'safeOwnerENSList'
export const FIELD_NEW_SAFE_THRESHOLD = 'newSafeThreshold'
export const FIELD_MAX_OWNER_NUMBER = 'maxOwnerNumber'
export const FIELD_NEW_SAFE_PROXY_SALT = 'safeCreationSalt'
export const FIELD_NEW_SAFE_GAS_LIMIT = 'gasLimit'
export const FIELD_NEW_SAFE_GAS_PRICE = 'gasPrice'
export const FIELD_NEW_SAFE_GAS_MAX_PRIO_FEE = 'gasMaxPrioFee'
export const FIELD_NEW_SAFE_CREATION_TX_HASH = 'safeCreationTxHash'

export type OwnerFieldItem = {
  nameFieldName: string
  addressFieldName: string
}

export type CreateSafeFormValues = {
  [FIELD_CREATE_SUGGESTED_SAFE_NAME]: string
  [FIELD_CREATE_CUSTOM_SAFE_NAME]?: string
  [FIELD_NEW_SAFE_THRESHOLD]: number
  [FIELD_SAFE_OWNERS_LIST]: Array<OwnerFieldItem>
  [FIELD_SAFE_OWNER_ENS_LIST]: Record<string, string>
  [FIELD_MAX_OWNER_NUMBER]: number
  [FIELD_NEW_SAFE_PROXY_SALT]: number
  [FIELD_NEW_SAFE_GAS_LIMIT]: number
  [FIELD_NEW_SAFE_GAS_PRICE]: string
  [FIELD_NEW_SAFE_GAS_MAX_PRIO_FEE]: number
  [FIELD_NEW_SAFE_CREATION_TX_HASH]?: string
}

export const SAFE_PENDING_CREATION_STORAGE_KEY = 'NEW_SAFE_PENDING_CREATION_STORAGE_KEY'
