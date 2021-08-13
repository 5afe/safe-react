import axios from 'axios'
import { BigNumber } from 'bignumber.js'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { getGasPrice, getGasPriceOracles } from 'src/config'
import { GasPriceOracle } from 'src/config/networks/network'
import { CodedException, Errors } from '../exceptions/CodedException'

export const EMPTY_DATA = '0x'

const fetchGasPrice = async (gasPriceOracle: GasPriceOracle): Promise<string> => {
  const { url, gasParameter, gweiFactor } = gasPriceOracle
  const { data: response } = await axios.get(url)
  const data = response.data || response // Sometimes the data comes with a data parameter
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
  // If no oracle worked we return an error
  const err = new CodedException(Errors._611, 'gasPrice or gasPriceOracle not set in config')
  return Promise.reject(err)
}

export const calculateGasOf = async (txConfig: {
  to: string
  from: string
  data: string
  gasPrice?: number
  gas?: number
}): Promise<number> => {
  const web3 = getWeb3()
  try {
    const gas = await web3.eth.estimateGas(txConfig)

    return gas
  } catch (err) {
    return Promise.reject(err)
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
