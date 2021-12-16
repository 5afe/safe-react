import { EthAdapterTransaction } from '@gnosis.pm/safe-core-sdk'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import { getSDKWeb3ReadOnly, getWeb3, getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { getFixedGasPrice, getGasPriceOracles } from 'src/config'
import { CodedException, Errors } from '../exceptions/CodedException'
import { GasPriceOracle } from '@gnosis.pm/safe-react-gateway-sdk'

export const EMPTY_DATA = '0x'

const fetchGasPrice = async (gasPriceOracle: GasPriceOracle): Promise<string> => {
  const { uri, gasParameter, gweiFactor } = gasPriceOracle
  const { data: response } = await axios.get(uri)
  const data = response.data || response.result || response // Sometimes the data comes with a data parameter
  return new BigNumber(data[gasParameter]).multipliedBy(gweiFactor).toString()
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
  const web3 = getWeb3()
  try {
    return await web3.eth.getTransactionCount(userAddress, 'pending')
  } catch (error) {
    return Promise.reject(error)
  }
}
