import { LoadFormValues } from 'src/routes/load/container/Load'
import { padOwnerIndex } from 'src/routes/open/utils/padOwnerIndex'
import { CreateSafeValues } from 'src/routes/open/utils/safeDataExtractor'

export const FIELD_CONFIRMATIONS = 'confirmations'
export const FIELD_OWNERS = 'owners'
export const FIELD_SAFE_NAME = 'safeName'
export const FIELD_CUSTOM_SAFE_NAME = 'customSafeName'
export const FIELD_CREATION_PROXY_SALT = 'safeCreationSalt'

export const getOwnerNameBy = (index: number): string => `owner${padOwnerIndex(index)}Name`
export const getOwnerAddressBy = (index: number): string => `owner${padOwnerIndex(index)}Address`

export const getNumOwnersFrom = (values: CreateSafeValues | LoadFormValues): number => {
  const accounts = Object.keys(values)
    .sort()
    .filter((key) => {
      const res = /^owner\d+Address$/.test(key)

      return res && !!values[key]
    })

  return accounts.length
}
