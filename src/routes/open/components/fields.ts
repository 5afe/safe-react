export const FIELD_NAME = 'name'
export const FIELD_CONFIRMATIONS = 'confirmations'
export const FIELD_OWNERS = 'owners'
export const FIELD_SAFE_NAME = 'safeName'
export const FIELD_CREATION_PROXY_SALT = 'safeCreationSalt'

export const getOwnerNameBy = (index: number): string => `owner${index}Name`
export const getOwnerAddressBy = (index: number): string => `owner${index}Address`

export const getNumOwnersFrom = (values) => {
  const accounts = Object.keys(values)
    .sort()
    .filter((key) => {
      const res = /^owner\d+Address$/.test(key)

      return res && !!values[key]
    })

  return accounts.length
}
