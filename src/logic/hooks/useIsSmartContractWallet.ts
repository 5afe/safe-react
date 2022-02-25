import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { currentChainId } from 'src/logic/config/store/selectors'
import { isSmartContractWallet } from 'src/logic/wallets/getWeb3'

const useIsSmartContractWallet = (userAccount: string): boolean => {
  const [isSmart, setIsSmart] = useState<boolean>(false)
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    let isCurrent = true
    const getIsSmartContractWallet = async () => {
      const res = await isSmartContractWallet(userAccount)
      if (isCurrent) {
        setIsSmart(res)
      }
    }
    getIsSmartContractWallet()

    return () => {
      isCurrent = false
    }
  }, [chainId, userAccount])

  return isSmart
}

export default useIsSmartContractWallet
