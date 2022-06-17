import { getDelegates } from '@gnosis.pm/safe-react-gateway-sdk'
import { DelegateResponse, DelegatesRequest } from '@gnosis.pm/safe-react-gateway-sdk/dist/types/delegates'

export const fetchDelegates = async (
  chainId: string,
  query?: DelegatesRequest | undefined,
): Promise<DelegateResponse> => {
  const res = await getDelegates(chainId, query)
  return res
}
