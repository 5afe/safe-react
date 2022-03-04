import { useEffect, useState } from 'react'

import { isSmartContractWallet } from 'src/logic/wallets/getWeb3'

const useIsSmartContractWallet = (userAccount: string): boolean => {
  const [isSmart, setIsSmart] = useState<boolean>(false)

  useEffect(() => {
    let isCurrent = true

    const checkAddress = async () => {
      // isSmartContractWallet is memoized
      const res = await isSmartContractWallet(userAccount)
      if (isCurrent) setIsSmart(res)
    }
    checkAddress()

    return () => {
      isCurrent = false
    }
  }, [userAccount])

  return isSmart
}

export default useIsSmartContractWallet
