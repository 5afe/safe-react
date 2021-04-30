import axios, { AxiosResponse } from 'axios'
import { buildSafeInformationUrl } from './buildSafeInformationUrl'

type AddressValue = {
  value: string
}

type AddressInfo = AddressValue & {
  name?: string
  logoUrl?: string
}

export type SafeInfo = {
  address: AddressValue
  nonce: number
  threshold: number
  implementation: AddressInfo
  owners: AddressValue[]
  modules: AddressValue[]
  fallbackHandler: AddressInfo
  version: string
}

export type SafeInfoError = {
  code: number
  message: string
  arguments: string[]
}

export const getSafeInfo = (safeAddress: string): Promise<SafeInfo> => {
  const safeInfoUrl = buildSafeInformationUrl(safeAddress)
  return axios.get<SafeInfo, AxiosResponse<SafeInfo>>(safeInfoUrl).then((response) => response.data)
}
