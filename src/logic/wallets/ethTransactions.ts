import { EthAdapterTransaction } from '@gnosis.pm/safe-core-sdk'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import { getGasPrice, getGasPriceOracles } from 'src/config'
import { GasPriceOracle } from 'src/config/networks/network'
import { getSDKWeb3Adapter, getWeb3, getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { CodedException, Errors } from '../exceptions/CodedException'

export const EMPTY_DATA = '0x'
/**
 * The magic number is from web3.js
 * @see https://github.com/ChainSafe/web3.js/blob/c70722b919ac81e45760b9648c4b92fd8d0eeee1/packages/web3-core-method/src/index.js#L869
 */
const FIXED_GAS_FEE = '2.5'

const fetchGasPrice = async (gasPriceOracle: GasPriceOracle): Promise<string> => {
  const { url, gasParameter, gweiFactor } = gasPriceOracle
  const { data: response } = await axios.get(url)
  const data = response.data || response.result || response // Sometimes the data comes with a data parameter
  return new BigNumber(data[gasParameter]).multipliedBy(gweiFactor).toString()
}

export const calculateGasPrice = async (): Promise<string> => {
  const gasPrice = getGasPrice()
  const gasPriceOracles = getGasPriceOracles()

  if (gasPrice) {
    // Fixed gas price in configuration. xDai uses this approach
    return new BigNumber(gasPrice).toString()
  } else if (gasPriceOracles) {
    for (let index = 0; index < gasPriceOracles.length; index++) {
      const gasPriceOracle = gasPriceOracles[index]
      try {
        const fetchedGasPrice = await fetchGasPrice(gasPriceOracle)
        return fetchedGasPrice
      } catch (err) {
        // Keep iterating price oracles
      }
    }
  }

  // A fallback based on the latest mined blocks when none of the oracles are working
  const web3ReadOnly = getWeb3ReadOnly()
  const fixedFee = web3ReadOnly.utils.toWei(FIXED_GAS_FEE, 'gwei')
  const lastFee = await web3ReadOnly.eth.getGasPrice()
  return BigNumber.sum(fixedFee, lastFee).toString()
}

export const calculateGasOf = async (txConfig: EthAdapterTransaction): Promise<number> => {
  try {
    const ethAdapter = getSDKWeb3Adapter(txConfig.from)

    return await ethAdapter.estimateGas(txConfig)
  } catch (err) {
    throw new CodedException(Errors._612, err.message)
  }
}

export const getUserNonce = async (userAddress: string): Promise<number> => {
  const web3 = getWeb3()
  try {
    return await web3.eth.getTransactionCount(userAddress, 'pending')
  } catch (error) {
    return Promise.reject(error)
  }
}
