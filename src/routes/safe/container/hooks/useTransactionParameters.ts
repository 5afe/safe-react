import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toWei } from 'web3-utils'

import { getUserNonce } from 'src/logic/wallets/ethTransactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { ParametersStatus } from 'src/routes/safe/components/Transactions/helpers/utils'
import { extractSafeAddress } from 'src/routes/routes'
import { AppReduxState } from 'src/store'
import { getRecommendedNonce } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

export type TxParameters = {
  safeNonce?: string
  setSafeNonce: (safeNonce?: string) => void
  safeTxGas?: string
  setSafeTxGas: (gas?: string) => void
  ethNonce?: string
  setEthNonce: (ethNonce?: string) => void
  ethGasLimit?: string
  setEthGasLimit: (ethGasLimit?: string) => void
  ethGasPrice?: string
  setEthGasPrice: (ethGasPrice?: string) => void
  ethMaxPrioFee?: string
  setEthMaxPrioFee: (maxPrioFee?: string) => void
  ethGasPriceInGWei?: string
  ethMaxPrioFeeInGWei?: string
}

type Props = {
  parametersStatus?: ParametersStatus
  initialSafeNonce?: string
  initialSafeTxGas?: string
  initialEthGasLimit?: string
  initialEthGasPrice?: string
  initialEthMaxPrioFee?: string
}

/**
 * This hooks is used to store tx parameter
 * It needs to be initialized calling setGasEstimation.
 */
export const useTransactionParameters = (props?: Props): TxParameters => {
  const connectedWalletAddress = useSelector(userAccountSelector)
  const safeAddress = extractSafeAddress()
  const safeVersion = useSelector(currentSafeCurrentVersion) as string
  const state = useSelector((state: AppReduxState) => state)

  // Safe Params
  const [safeNonce, setSafeNonce] = useState<string | undefined>(props?.initialSafeNonce)
  // SafeTxGas: for a new Tx call requiredTxGas, for an existing tx get it from the backend.
  const [safeTxGas, setSafeTxGas] = useState<string | undefined>(props?.initialSafeTxGas)

  // ETH Params
  const [ethNonce, setEthNonce] = useState<string | undefined>() // we delegate it to the wallet
  const [ethGasLimit, setEthGasLimit] = useState<string | undefined>(props?.initialEthGasLimit) // call execTx until it returns a number > 0
  const [ethGasPrice, setEthGasPrice] = useState<string | undefined>(props?.initialEthGasPrice) // get fast gas price
  const [ethGasPriceInGWei, setEthGasPriceInGWei] = useState<string>() // get fast gas price
  const [ethMaxPrioFee, setEthMaxPrioFee] = useState<string>() // get max prio fee
  const [ethMaxPrioFeeInGWei, setEthMaxPrioFeeInGWei] = useState<string>() // get max prio fee in gwei

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
    setEthGasPriceInGWei(toWei(ethGasPrice, 'Gwei'))
  }, [ethGasPrice])

  // Get max prio fee
  useEffect(() => {
    if (!ethMaxPrioFee) {
      setEthMaxPrioFee(undefined)
      return
    }
    setEthMaxPrioFeeInGWei(toWei(ethMaxPrioFee, 'Gwei'))
  }, [ethMaxPrioFee])

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
    ethMaxPrioFee,
    setEthMaxPrioFee,
    ethGasPriceInGWei,
    ethMaxPrioFeeInGWei,
  }
}
