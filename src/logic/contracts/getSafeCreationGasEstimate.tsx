import { estimateGasForDeployingSafe } from 'src/logic/contracts/safeContracts'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { getNetworkInfo } from 'src/config'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { throttle } from 'lodash'

type getEstimateSafeCreationGasProps = {
  addresses: string[]
  numOwners: number
  safeCreationSalt: number
  userAccount: string
}

type SafeCreationEstimationResult = {
  gasEstimation: number // Amount of gas needed for execute or approve the transaction
  gasCostFormatted: string // Cost of gas in format '< | > 100'
  gasLimit: number // Minimum gas requited to execute the Tx
}

const { nativeCoin } = getNetworkInfo()
export const DEFAULT_GAS = '< 0.001'

const estimateSafeCreationGas = async ({
  addresses,
  numOwners,
  safeCreationSalt,
  userAccount,
}: getEstimateSafeCreationGasProps): Promise<SafeCreationEstimationResult> => {
  if (!addresses.length || !numOwners || !userAccount) {
    return {
      gasEstimation: 0,
      gasCostFormatted: DEFAULT_GAS,
      gasLimit: 0,
    }
  }
  const gasEstimation = await estimateGasForDeployingSafe(addresses, numOwners, userAccount, safeCreationSalt)
  const gasPrice = await calculateGasPrice()
  const estimatedGasCosts = gasEstimation * parseInt(gasPrice, 10)
  const gasCost = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
  const gasCostFormatted = formatAmount(gasCost)
  return {
    gasEstimation,
    gasCostFormatted,
    gasLimit: gasEstimation,
  }
}

export const getSafeCreationGasEstimate = throttle(estimateSafeCreationGas, 10000)
