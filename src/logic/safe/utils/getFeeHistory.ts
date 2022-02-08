import { FeeHistoryResult } from 'web3-eth'
import { hexToNumber } from 'web3-utils'

import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { logError, Errors } from 'src/logic/exceptions/CodedException'

const DEFAULT_MAX_GAS_FEE = 3.5e9 // 3.5 GWEI
const DEFAULT_MAX_PRIO_FEE = 2.5e9 // 2.5 GWEI

export const clampMaxPrioFeePerGas = (maxPriorityFeePerGas: number, maxFeePerGas: number): number => {
  if (maxPriorityFeePerGas > maxFeePerGas) {
    const minMaxPrioFee = 0.001
    const maxMaxPrioFee = maxFeePerGas - 1

    return Math.max(minMaxPrioFee, maxMaxPrioFee)
  }

  return maxPriorityFeePerGas
}

export const getFeesPerGas = async (): Promise<{
  maxFeePerGas: number
  maxPriorityFeePerGas: number
}> => {
  let blocks: FeeHistoryResult | undefined
  let maxPriorityFeePerGas: number | undefined
  let baseFeePerGas: number | undefined

  const web3 = getWeb3ReadOnly()

  try {
    // Lastest block, 50th reward percentile
    blocks = await web3.eth.getFeeHistory(1, 'latest', [50])

    // hexToNumber can throw if not parsing a valid hex string
    baseFeePerGas = hexToNumber(blocks.baseFeePerGas[0])
    maxPriorityFeePerGas = hexToNumber(blocks.reward[0][0])
  } catch (err) {
    logError(Errors._618, err.message)
  }

  if (!blocks || !maxPriorityFeePerGas || isNaN(maxPriorityFeePerGas) || !baseFeePerGas || isNaN(baseFeePerGas)) {
    return {
      maxFeePerGas: DEFAULT_MAX_GAS_FEE,
      maxPriorityFeePerGas: DEFAULT_MAX_PRIO_FEE,
    }
  }

  return {
    maxFeePerGas: baseFeePerGas + maxPriorityFeePerGas,
    maxPriorityFeePerGas,
  }
}
