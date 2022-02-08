import { hexToNumber } from 'web3-utils'

import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'

export const clampMaxPrioFeePerGas = (maxPriorityFeePerGas: number, maxFeePerGas: number): number => {
  if (maxPriorityFeePerGas > maxFeePerGas) {
    const MIN_MAX_PRIO_FEE = 0.5
    const MAX_MAX_PRIO_FEE = maxFeePerGas - 1

    return Math.max(MIN_MAX_PRIO_FEE, MAX_MAX_PRIO_FEE)
  }

  return maxPriorityFeePerGas
}

const DEFAULT_MAX_PRIO_FEE = 2.5e9 // 2.5 GWEI
export const getMedianMaxPrioFee = async (): Promise<number> => {
  const HISTORICAL_BLOCKS = 4

  const web3 = getWeb3ReadOnly()

  try {
    // [0] slow, [1] average, [2] fast reward percentiles ([3] pending)
    const blocks = await web3.eth.getFeeHistory(HISTORICAL_BLOCKS, 'pending', [25, 50, 75])

    const baseFeePerGas = hexToNumber(blocks.baseFeePerGas[1])
    const maxPriorityFeePerGas = hexToNumber(blocks.reward[1][1])
    const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas

    return clampMaxPrioFeePerGas(maxPriorityFeePerGas, maxFeePerGas)
  } catch {
    return DEFAULT_MAX_PRIO_FEE
  }
}
