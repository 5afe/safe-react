import { FeeHistoryResult } from 'web3-eth'
import { hexToNumber } from 'web3-utils'

import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { logError, Errors } from 'src/logic/exceptions/CodedException'

const DEFAULT_MAX_PRIO_FEE = 2.5e9 // 2.5 GWEI

export const clampMaxPrioFeePerGas = (maxPriorityFeePerGas: number, maxFeePerGas: number): number => {
  if (maxPriorityFeePerGas > maxFeePerGas) {
    const minMaxPrioFee = 0.001
    const maxMaxPrioFee = maxFeePerGas - 1

    return Math.max(minMaxPrioFee, maxMaxPrioFee)
  }

  return maxPriorityFeePerGas
}

export const getMaxPriorityFeePerGas = async (): Promise<number> => {
  let blocks: FeeHistoryResult | undefined
  let maxPriorityFeePerGas: number | undefined

  const web3 = getWeb3ReadOnly()

  try {
    // Lastest block, 50th reward percentile
    blocks = await web3.eth.getFeeHistory(1, 'latest', [50])
    maxPriorityFeePerGas = hexToNumber(blocks.reward[0][0])
  } catch (err) {
    logError(Errors._618, err.message)
  }

  if (!blocks || !maxPriorityFeePerGas || isNaN(maxPriorityFeePerGas)) {
    return DEFAULT_MAX_PRIO_FEE
  }

  return maxPriorityFeePerGas
}
