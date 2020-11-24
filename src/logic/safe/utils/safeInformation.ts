import axios, { AxiosError, AxiosResponse } from 'axios'
import { buildSafeInformationUrl } from './buildSafeInformationUrl'

export type SafeInfo = {
  address: string
  nonce: number
  threshold: number
  owners: string[]
  masterCopy: string
  modules: string[]
  fallbackHandler: string
  version: string
}

export type SafeInfoError = {
  code: number
  message: string
  arguments: string[]
}

export const getSafeInfo = (safeAddress: string): Promise<void | SafeInfo> => {
  const safeInfoUrl = buildSafeInformationUrl(safeAddress)
  return axios
    .get<SafeInfo, AxiosResponse<SafeInfo>>(safeInfoUrl)
    .then((response) => response.data)
    .catch((error: AxiosError<SafeInfoError>) => {
      console.error(
        'Failed to retrieve safe Information',
        error.response?.statusText ?? error.response?.data.message ?? error,
      )
    })
}
