import axios, { AxiosResponse } from 'axios'
import { buildSafeInformationUrl } from './buildSafeInformationUrl'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'

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
  modules: AddressValue[] | null
  fallbackHandler: AddressInfo
  version: string
}

export type SafeInfoError = {
  code: number
  message: string
  arguments: string[]
}

export const getSafeInfo = async (safeAddress: string): Promise<SafeInfo> => {
  const safeInfoUrl = buildSafeInformationUrl(safeAddress)
  try {
    const response = await axios.get<SafeInfo, AxiosResponse<SafeInfo>>(safeInfoUrl)
    return response.data
  } catch (e) {
    throw new CodedException(Errors._605, e.message)
  }
}
