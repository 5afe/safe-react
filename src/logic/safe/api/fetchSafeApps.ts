import { getSafeApps, SafeAppData } from '@gnosis.pm/safe-react-gateway-sdk'

export const fetchSafeAppsList = async (chainId: string): Promise<SafeAppData[]> => {
  return getSafeApps(chainId, {
    client_url: window.location.origin,
  })
}
