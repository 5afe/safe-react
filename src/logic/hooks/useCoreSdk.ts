import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Safe from '@gnosis.pm/safe-core-sdk'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { logError, Errors } from 'src/logic/exceptions/CodedException'

const useCoreSdk = (): Safe | void => {
  const { currentVersion, address } = useSelector(currentSafe) ?? {}
  const walletAddress = useSelector(userAccountSelector)
  const [sdk, setSdk] = useState<Safe>()

  useEffect(() => {
    let isCurrent = true

    getSafeSDK(walletAddress, address, currentVersion)
      .then((val) => (isCurrent ? setSdk(val) : null))
      .catch((err) => {
        logError(Errors._818, err.message)
      })

    return () => {
      isCurrent = false
    }
  }, [walletAddress, currentVersion, address])

  return sdk
}

export default useCoreSdk
