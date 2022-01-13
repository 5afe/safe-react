import { FiatCurrencies, getFiatCurrencies } from '@gnosis.pm/safe-react-gateway-sdk'
import { getGatewayUrl } from 'src/config'

export const fetchAvailableCurrencies = async (): Promise<FiatCurrencies> => {
  return getFiatCurrencies(getGatewayUrl())
}
