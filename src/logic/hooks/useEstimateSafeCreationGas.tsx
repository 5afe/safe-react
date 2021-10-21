import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { estimateGasForDeployingSafe } from 'src/logic/contracts/safeContracts'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { getNetworkInfo } from 'src/config'

import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { userAccountSelector } from '../wallets/store/selectors'

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

const estimateGas = async (
  userAccount: string,
  numOwners: number,
  safeCreationSalt: number,
  addresses: string[],
): Promise<SafeCreationEstimationResult> => {
  const [gasEstimation, gasPrice] = await Promise.all([
    estimateGasForDeployingSafe(addresses, numOwners, userAccount, safeCreationSalt),
    calculateGasPrice(),
  ])
  const estimatedGasCosts = gasEstimation * parseInt(gasPrice, 10)
  const { nativeCoin } = getNetworkInfo()
  const gasCost = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
  const gasCostFormatted = formatAmount(gasCost)

  return {
    gasEstimation,
    gasCostFormatted,
    gasLimit: gasEstimation,
  }
}

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
  // Serialize the addresses array so that it doesn't trigger the effect due to the dependencies
  const addressesSerialized = JSON.stringify(addresses)

  useEffect(() => {
    const addressesList = JSON.parse(addressesSerialized)
    if (!addressesList.length || !numOwners || !userAccount) {
      return
    }

    estimateGas(userAccount, numOwners, safeCreationSalt, addressesList)?.then(setGasEstimation)
  }, [numOwners, safeCreationSalt, addressesSerialized, userAccount])

  return gasEstimation
}
