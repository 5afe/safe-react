import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getUserNonce } from 'src/logic/wallets/ethTransactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getLastTx, getNewTxNonce } from 'src/logic/safe/store/actions/utils'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { safeSelector } from 'src/logic/safe/store/selectors'

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
}

/**
 * This hooks is used to store tx parameter
 * It needs to be initialized calling setGasEstimation.
 */
export const useTransactionParameters = (): TxParameters => {
  //const [gasEstimation, setGasEstimation] = useState<GasEstimationInfo | undefined>()
  const connectedWalletAddress = useSelector(userAccountSelector)
  const { address: safeAddress } = useSelector(safeSelector) || {}

  /* Safe Params */
  const [safeNonce, setSafeNonce] = useState<string | undefined>(undefined)
  // SafeTxGas: for a new Tx call requiredTxGas, for an existing tx get it from the backend.
  const [safeTxGas, setSafeTxGas] = useState<string | undefined>(undefined)

  /* ETH Params */
  const [ethNonce, setEthNonce] = useState<string | undefined>(undefined) // we delegate it to the wallet
  const [ethGasLimit, setEthGasLimit] = useState<string | undefined>(undefined) // call execTx until it returns a number > 0
  const [ethGasPrice, setEthGasPrice] = useState<string | undefined>(undefined) // get fast gas price

  /* get nonce for connected wallet */
  useEffect(() => {
    const getNonce = async () => {
      const res = await getUserNonce(connectedWalletAddress)
      setEthNonce(res.toString())
    }

    if (connectedWalletAddress) {
      getNonce()
    }
  }, [connectedWalletAddress])

  /* calc safe nonce */
  useEffect(() => {
    const getSafeNonce = async () => {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress as string)
      const lastTx = await getLastTx(safeAddress as string)
      const nonce = await getNewTxNonce(lastTx, safeInstance)
      setSafeNonce(nonce)
    }

    if (safeAddress) {
      getSafeNonce()
    }
  }, [safeAddress])

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
  }
}
