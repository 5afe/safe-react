import { hexToNumber } from 'web3-utils'

import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'

export const clampMaxPrioFeePerGas = (maxPriorityFeePerGas: number, maxFeePerGas: number): number => {
  if (maxPriorityFeePerGas > maxFeePerGas) {
    const MIN_MAX_PRIO_FEE = 0.5
    const MAX_MAX_PRIO_FEE = maxFeePerGas - 1

    return Math.max(MIN_MAX_PRIO_FEE, MAX_MAX_PRIO_FEE)
  }

  // We must round as BN does not support decimals
  return Math.round(maxPriorityFeePerGas)
}

export const getMedianMaxPrioFee = async (): Promise<number> => {
  const HISTORICAL_BLOCKS = 4

  const web3 = getWeb3ReadOnly()

  // [0] slow, [1] average, [2] fast reward percentiles ([3] pending)
  const blocks = await web3.eth.getFeeHistory(HISTORICAL_BLOCKS, 'pending', [25, 50, 75])

  const baseFeePerGas = hexToNumber(blocks.baseFeePerGas[1])
  const maxPriorityFeePerGas =
    blocks.reward.reduce((acc, reward) => acc + hexToNumber(reward[1]), 0) / blocks.reward.length
  const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas

  return clampMaxPrioFeePerGas(maxPriorityFeePerGas, maxFeePerGas)
}
