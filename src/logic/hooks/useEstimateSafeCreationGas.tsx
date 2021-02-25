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

export const useEstimateSafeCreationGas = ({
  addresses,
  numOwners,
  safeCreationSalt,
}: EstimateSafeCreationGasProps): SafeCreationEstimationResult => {
  const [gasEstimation, setGasEstimation] = useState<SafeCreationEstimationResult>({
    gasEstimation: 0,
    gasCostFormatted: '< 0.001',
    gasLimit: 0,
  })
  const userAccount = useSelector(userAccountSelector)

  useEffect(() => {
    const estimateGas = async () => {
      if (!addresses.length || !numOwners || !userAccount) {
        return
      }

      const gasEstimation = await estimateGasForDeployingSafe(addresses, numOwners, userAccount, safeCreationSalt)
      const gasPrice = await calculateGasPrice()
      const estimatedGasCosts = gasEstimation * parseInt(gasPrice, 10)
      const gasCost = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
      const gasCostFormatted = formatAmount(gasCost)

      setGasEstimation({
        gasEstimation,
        gasCostFormatted,
        gasLimit: gasEstimation,
      })
    }

    estimateGas()
  }, [numOwners, userAccount, safeCreationSalt, addresses])

  return gasEstimation
}
