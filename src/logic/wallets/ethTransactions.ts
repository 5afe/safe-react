import { EthAdapterTransaction } from '@gnosis.pm/safe-core-sdk-types'
import { GasPriceOracle } from '@gnosis.pm/safe-react-gateway-sdk'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import { FeeHistoryResult } from 'web3-eth'
import { hexToNumber } from 'web3-utils'

import { getSDKWeb3ReadOnly, getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { getFixedGasPrice, getGasPriceOracles } from 'src/config'
import { CodedException, Errors, logError } from 'src/logic/exceptions/CodedException'

export const EMPTY_DATA = '0x'

export const DEFAULT_MAX_GAS_FEE = 3.5e9 // 3.5 GWEI
export const DEFAULT_MAX_PRIO_FEE = 2.5e9 // 2.5 GWEI

const fetchGasPrice = async (gasPriceOracle: GasPriceOracle): Promise<string> => {
  const { uri, gasParameter, gweiFactor } = gasPriceOracle
  const { data: response } = await axios.get(uri)
  const data = response.data || response.result || response // Sometimes the data comes with a data parameter

  const gasPrice = new BigNumber(data[gasParameter]).multipliedBy(gweiFactor)
  if (gasPrice.isNaN()) {
    throw new Error('Fetched gas price is NaN')
  }
  return gasPrice.toString()
}

export const setMaxPrioFeePerGas = (maxPriorityFeePerGas: number, maxFeePerGas: number): number => {
  return maxPriorityFeePerGas > maxFeePerGas ? maxFeePerGas : maxPriorityFeePerGas
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

export const calculateGasPrice = async (): Promise<string> => {
  const gasPriceOracles = getGasPriceOracles()

  for (const gasPriceOracle of gasPriceOracles) {
    try {
      const fetchedGasPrice = await fetchGasPrice(gasPriceOracle)
      return fetchedGasPrice
    } catch (err) {
      // Keep iterating price oracles
    }
  }

  // A fallback to fixed gas price from the chain config
  const fixedGasPrice = getFixedGasPrice()
  if (fixedGasPrice) {
    return fixedGasPrice.weiValue
  }

  // A fallback based on the median of a few last blocks
  const web3ReadOnly = getWeb3ReadOnly()
  return await web3ReadOnly.eth.getGasPrice()
}

export const calculateGasOf = async (txConfig: EthAdapterTransaction): Promise<number> => {
  try {
    const ethAdapter = getSDKWeb3ReadOnly()

    return await ethAdapter.estimateGas(txConfig)
  } catch (err) {
    throw new CodedException(Errors._612, err.message)
  }
}

export const getUserNonce = async (userAddress: string): Promise<number> => {
  const web3 = getWeb3ReadOnly()
  try {
    return await web3.eth.getTransactionCount(userAddress, 'pending')
  } catch (error) {
    return Promise.reject(error)
  }
}
