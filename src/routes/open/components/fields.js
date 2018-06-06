// @flow
export const FIELD_NAME: string = 'name'
export const FIELD_CONFIRMATIONS: string = 'confirmations'
export const FIELD_OWNERS: string = 'owners'
export const FIELD_DAILY_LIMIT: string = 'limit'

export const getOwnerNameBy = (index: number) => `owner${index}Name`
export const getOwnerAddressBy = (index: number) => `owner${index}Address`
