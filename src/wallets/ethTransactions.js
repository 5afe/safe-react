// @flow
import { BigNumber } from 'bignumber.js'
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'

// const MAINNET_NETWORK = 1

export const checkReceiptStatus = async (hash: string) => {
  if (!hash) {
    throw new Error('No valid Tx hash to get receipt from')
  }

  const web3 = getWeb3()
  const txReceipt = await promisify(cb => web3.eth.getTransactionReceipt(hash, cb))

  const { status } = txReceipt
  if (!status) {
    throw new Error('No status found on this transaction receipt')
  }

  const hasError = status === '0x0'
  if (hasError) {
    throw new Error('Obtained a transaction failure in the receipt')
  }
}

// export const calculateGasPrice = async () => '1000000000'

export const calculateGasPrice = async () => {
  /*
  const web3 = getWeb3()
  const { network } = web3.version
  const isMainnet = MAINNET_NETWORK === network

  const url = isMainnet
    ? 'https://safe-relay.staging.gnosisdev.com/api/v1/gas-station/'
    : 'https://safe-relay.dev.gnosisdev.com/'
  */
  const corsProblem = process.env.NODE_ENV === 'test'
  if (corsProblem) {
    return '4000000'
  }

  const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json')
  if (!response.ok) {
    throw new Error('Error querying gast station')
  }

  const json = await response.json()

  return new BigNumber(json.average).multipliedBy(1e8).toString()
}

export const calculateGasOf = async (data: Object, from: string, to: string) => {
  const web3 = getWeb3()
  const gas = await promisify(cb => web3.eth.estimateGas({ data, from, to }, cb))

  return gas * 2
}
