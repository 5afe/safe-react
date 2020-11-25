import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { getNetworkInfo } from 'src/config'
import { Token } from 'src/logic/tokens/store/model/token'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { tokenListSelector } from 'src/logic/tokens/store/selectors'

const { nativeCoin } = getNetworkInfo()

const useTokenInfo = (address: string): Token | undefined => {
  const tokens = useSelector(tokenListSelector)

  return useMemo(() => {
    if (tokens) {
      const tokenAddress = sameAddress(address, ZERO_ADDRESS) ? nativeCoin.address : address
      return tokens.find((token) => sameAddress(token.address, tokenAddress)) ?? undefined
    }
  }, [address, tokens])
}

export default useTokenInfo
