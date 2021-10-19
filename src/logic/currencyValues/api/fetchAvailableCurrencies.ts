import { FiatCurrencies, getFiatCurrencies } from '@gnosis.pm/safe-react-gateway-sdk'
import { getClientGatewayUrl } from 'src/config'

export const fetchAvailableCurrencies = async (): Promise<FiatCurrencies> => {
  return getFiatCurrencies(getClientGatewayUrl())
}
