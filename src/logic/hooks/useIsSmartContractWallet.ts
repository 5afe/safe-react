import { useSelector } from 'react-redux'

import { currentChainId } from 'src/logic/config/store/selectors'
import { isSmartContractWallet } from 'src/logic/wallets/getWeb3'
import useAsyncValue from 'src/logic/hooks/useAsyncValue'

const useIsSmartContractWallet = (userAccount: string): boolean => {
  const chainId = useSelector(currentChainId)

  // chainId is not an argument of isSmartContractWallet, but it is used as
  // dependency. isSmartContract calls getWeb3ReadOnly(), which relates to the chainId
  const result = useAsyncValue<boolean>(isSmartContractWallet, () => [userAccount, chainId])

  // isSmartContract doesn't throw so we only return result
  return result[0] || false
}

export default useIsSmartContractWallet
