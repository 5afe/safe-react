// @flow
import { BigNumber } from 'bignumber.js'
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'

// const MAINNET_NETWORK = 1

const calculateGasPrice = async () => {
/*
  const web3 = getWeb3()
  const { network } = web3.version
  const isMainnet = MAINNET_NETWORK === network

  const url = isMainnet
    ? 'https://safe-relay.staging.gnosisdev.com/api/v1/gas-station/'
    : 'https://safe-relay.dev.gnosisdev.com/'
*/

  const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json', { mode: 'cors' })
  if (!response.ok) {
    throw new Error('Error querying gast station')
  }

  const json = await response.json()

  return new BigNumber(json.average).multipliedBy(1e8).toString()
}

const calculateGasOf = async (data: Object, from: string, to: string) => {
  const web3 = getWeb3()

  return promisify(cb => web3.eth.estimateGas({ data, from, to }, cb))
}

const executeTransaction = async (data: Object, from: string, to: string) => {
  const web3 = getWeb3()

  const gas = await calculateGasOf(data, from, to) + 2000

  let gasPrice
  try {
    gasPrice = await calculateGasPrice()
  } catch (err) {
    gasPrice = await promisify(cb => web3.eth.getGasPrice(cb))
  }

  return promisify(cb => web3.eth.sendTransaction({
    from, to, data, gas, gasPrice,
  }, cb))
}

export default executeTransaction
