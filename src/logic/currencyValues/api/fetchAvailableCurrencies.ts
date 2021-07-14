import { getFiatCurrencies, GatewayDefinitions } from '@gnosis.pm/safe-react-gateway-sdk'
import { getClientGatewayUrl } from 'src/config'

export const fetchAvailableCurrencies = async (): Promise<GatewayDefinitions['FiatCurrencies']> => {
  return getFiatCurrencies(getClientGatewayUrl())
}
