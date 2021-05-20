import axios from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export type EtherBalanceServiceModel = {
  tokenAddress: null
  token: null
  balance: string
}

export type TokenBalanceServiceModel = {
  tokenAddress: string
  token: TokenServiceModel
  balance: string
}

export type TokenServiceModel = {
  name: string
  symbol: string
  decimals: number
  logoUri: string
}

export type ServiceTokenBalances = (EtherBalanceServiceModel | TokenBalanceServiceModel)[]

type Params = {
  safeAddress: string
  excludeSpam?: boolean
  trusted?: boolean
}

export const fetchTokenBalances = ({
  safeAddress,
  excludeSpam = true,
  trusted = false,
}: Params): Promise<ServiceTokenBalances> => {
  const url = `${getSafeServiceBaseUrl(
    checksumAddress(safeAddress),
  )}/balances?trusted=${trusted}&exclude_spam=${excludeSpam}`

  return axios.get<ServiceTokenBalances>(url).then(({ data }) => data)
}
