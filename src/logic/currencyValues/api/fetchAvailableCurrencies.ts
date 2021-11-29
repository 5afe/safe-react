import { FiatCurrencies, getFiatCurrencies } from '@gnosis.pm/safe-react-gateway-sdk'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

export const fetchAvailableCurrencies = async (): Promise<FiatCurrencies> => {
  return getFiatCurrencies(CONFIG_SERVICE_URL)
}
