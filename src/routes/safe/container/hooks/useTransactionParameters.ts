import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toWei } from 'web3-utils'

import { getUserNonce } from 'src/logic/wallets/ethTransactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { ParametersStatus } from 'src/routes/safe/components/Transactions/helpers/utils'
import { sameString } from 'src/utils/strings'
import { extractSafeAddress } from 'src/routes/routes'
import { AppReduxState } from 'src/store'
import { getRecommendedNonce } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

export type TxParameters = {
  safeNonce: string | undefined
  setSafeNonce: (safeNonce: string | undefined) => void
  safeTxGas: string | undefined
  setSafeTxGas: (gas: string | undefined) => void
  ethNonce: string | undefined
  setEthNonce: (ethNonce: string | undefined) => void
  ethGasLimit: string | undefined
  setEthGasLimit: (ethGasLimit: string | undefined) => void
  ethGasPrice: string | undefined
  setEthGasPrice: (ethGasPrice: string | undefined) => void
  ethGasPriceInGWei: string | undefined
}

type Props = {
  parameterStatus?: ParametersStatus
  initialSafeNonce?: string
  initialSafeTxGas?: string
  initialEthGasLimit?: string
  initialEthGasPrice?: string
}

/**
 * This hooks is used to store tx parameter
 * It needs to be initialized calling setGasEstimation.
 */
export const useTransactionParameters = (props?: Props): TxParameters => {
  const isCancelTransaction = sameString(props?.parameterStatus || 'ENABLED', 'CANCEL_TRANSACTION')
  const connectedWalletAddress = useSelector(userAccountSelector)
  const safeAddress = extractSafeAddress()
  const safeVersion = useSelector(currentSafeCurrentVersion) as string
  const state = useSelector((state: AppReduxState) => state)

  // Safe Params
  const [safeNonce, setSafeNonce] = useState<string | undefined>(props?.initialSafeNonce)
  // SafeTxGas: for a new Tx call requiredTxGas, for an existing tx get it from the backend.
  const [safeTxGas, setSafeTxGas] = useState<string | undefined>(isCancelTransaction ? '0' : props?.initialSafeTxGas)

  // ETH Params
  const [ethNonce, setEthNonce] = useState<string | undefined>() // we delegate it to the wallet
  const [ethGasLimit, setEthGasLimit] = useState<string | undefined>(props?.initialEthGasLimit) // call execTx until it returns a number > 0
  const [ethGasPrice, setEthGasPrice] = useState<string | undefined>(props?.initialEthGasPrice) // get fast gas price
  const [ethGasPriceInGWei, setEthGasPriceInGWei] = useState<string | undefined>() // get fast gas price

  // Get nonce for connected wallet
  useEffect(() => {
    const getNonce = async () => {
      const res = await getUserNonce(connectedWalletAddress)
      setEthNonce(res.toString())
    }

    if (connectedWalletAddress) {
      getNonce()
    }
  }, [connectedWalletAddress])

  // Get ETH gas price
  useEffect(() => {
    if (!ethGasPrice) {
      setEthGasPriceInGWei(undefined)
      return
    }
    if (isCancelTransaction) {
      setEthGasPrice('0')
      return
    }
    setEthGasPriceInGWei(toWei(ethGasPrice, 'Gwei'))
  }, [ethGasPrice, isCancelTransaction])

  // Calc safe nonce
  useEffect(() => {
    const getSafeNonce = async () => {
      if (safeAddress) {
        try {
          const recommendedNonce = (await getRecommendedNonce(safeAddress)).toString()
          setSafeNonce(recommendedNonce)
        } catch (e) {
          logError(Errors._616, e.message)
        }
      }
    }

    if (safeNonce === undefined) {
      getSafeNonce()
    }
  }, [safeAddress, safeVersion, safeNonce, state])

  return {
    safeNonce,
    setSafeNonce,
    safeTxGas,
    setSafeTxGas,
    ethNonce,
    setEthNonce,
    ethGasLimit,
    setEthGasLimit,
    ethGasPrice,
    setEthGasPrice,
    ethGasPriceInGWei,
  }
}
