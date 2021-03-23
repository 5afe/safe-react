import { useSelector } from 'react-redux'

import { Token } from 'src/logic/tokens/store/model/token'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { safeKnownCoins } from 'src/routes/safe/container/selector'

const useTokenInfo = (address: string): Token | undefined => {
  const tokens = useSelector(safeKnownCoins)

  if (tokens) {
    return tokens.find((token) => sameAddress(token.address, address))
  }
}

export default useTokenInfo
