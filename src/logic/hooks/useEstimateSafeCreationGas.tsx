import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { userAccountSelector } from '../wallets/store/selectors'
import { estimateGasForDeployingSafe } from 'src/logic/contracts/safeContracts'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { getNetworkInfo } from 'src/config'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'

type EstimateSafeCreationGasProps = {
  addresses: string[]
  numOwners: number
  safeCreationSalt: number
}

type SafeCreationEstimationResult = {
  gasEstimation: number // Amount of gas needed for execute or approve the transaction
  gasCostFormatted: string // Cost of gas in format '< | > 100'
  gasLimit: number // Minimum gas requited to execute the Tx
}

const { nativeCoin } = getNetworkInfo()
const DEFAULT_GAS = '< 0.001'
export const useEstimateSafeCreationGas = ({
  addresses,
  numOwners,
  safeCreationSalt,
}: EstimateSafeCreationGasProps): SafeCreationEstimationResult => {
  const [gasEstimation, setGasEstimation] = useState({
    gasEstimation: 0,
    gasLimit: 0,
  })
  const [gasCostFormatted, setGasCostFormated] = useState<string>(DEFAULT_GAS)
  const userAccount = useSelector(userAccountSelector)

  useEffect(() => {
    const estimateGasPrice = async () => {
      const gasPrice = await calculateGasPrice()
      const estimatedGasCosts = gasEstimation.gasEstimation * parseInt(gasPrice, 10)
      const gasCost = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
      const gasAmount = formatAmount(gasCost)
      setGasCostFormated(gasAmount)
    }
    if (gasEstimation.gasEstimation != 0) {
      estimateGasPrice()
    }
  }, [gasEstimation.gasEstimation])

  useEffect(() => {
    const estimateGas = async () => {
      if (!addresses.length || !numOwners || !userAccount) {
        return
      }

      const gasEstimation = await estimateGasForDeployingSafe(addresses, numOwners, userAccount, safeCreationSalt)

      setGasEstimation({
        gasEstimation,
        gasLimit: gasEstimation,
      })
    }

    estimateGas()
  }, [numOwners, userAccount, safeCreationSalt, addresses])

  return { ...gasEstimation, gasCostFormatted }
}
