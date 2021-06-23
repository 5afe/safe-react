import axios from 'axios'
import { BigNumber } from 'bignumber.js'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { getGasPrice, getGasPriceOracle } from 'src/config'

export const EMPTY_DATA = '0x'

export const calculateGasPrice = async (): Promise<string> => {
  const gasPrice = getGasPrice()
  const gasPriceOracle = getGasPriceOracle()

  if (gasPrice) {
    // Fixed gas price in configuration. xDai uses this approach
    return new BigNumber(gasPrice).toString()
  } else if (gasPriceOracle) {
    const { url, gasParameter } = gasPriceOracle

    // Fetch from gas price provider
    const { data } = await axios.get(url)

    return new BigNumber(data[gasParameter]).multipliedBy(1e8).toString()
  } else {
    const errorMsg = 'gasPrice or gasPriceOracle not set in config'
    return Promise.reject(errorMsg)
  }
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
