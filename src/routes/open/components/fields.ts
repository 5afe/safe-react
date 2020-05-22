export const FIELD_NAME = 'name'
export const FIELD_CONFIRMATIONS = 'confirmations'
export const FIELD_OWNERS = 'owners'
export const FIELD_SAFE_NAME = 'safeName'

export const getOwnerNameBy = (index) => `owner${index}Name`
export const getOwnerAddressBy = (index) => `owner${index}Address`

export const getNumOwnersFrom = (values) => {
  const accounts = Object.keys(values)
    .sort()
    .filter((key) => /^owner\d+Address$/.test(key) && !!values[key])

  return accounts.length
}
