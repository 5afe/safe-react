import { getClientGatewayUrl } from 'src/config'
import axios from 'axios'

export const fetchAvailableCurrencies = async (): Promise<string[]> => {
  const url = `${getClientGatewayUrl()}/balances/supported-fiat-codes`

  return axios.get(url).then(({ data }) => data)
}
