import axios from 'axios'
import { BigNumber } from 'bignumber.js'

import { getWeb3, web3ReadOnly } from 'src/logic/wallets/getWeb3'

// const MAINNET_NETWORK = 1
export const EMPTY_DATA = '0x'

export const checkReceiptStatus = async (hash) => {
  if (!hash) {
    return Promise.reject(new Error('No valid Tx hash to get receipt from'))
  }

  const txReceipt = await web3ReadOnly.eth.getTransactionReceipt(hash)

  const { status }: any = txReceipt
  if (!status) {
    return Promise.reject(new Error('No status found on this transaction receipt'))
  }

  const hasError = status === '0x0'
  if (hasError) {
    return Promise.reject(new Error('Obtained a transaction failure in the receipt'))
  }

  return Promise.resolve()
}

export const calculateGasPrice = async () => {
  /*
  const web3 = getWeb3()
  const { network } = web3.version
  const isMainnet = MAINNET_NETWORK === network

  const url = isMainnet
    ? 'https://safe-relay.staging.gnosisdev.com/api/v1/gas-station/'
    : 'https://safe-relay.dev.gnosisdev.com/'
  */

  if (process.env.NODE_ENV === 'test') {
    return '20000000000'
  }

  const url = 'https://ethgasstation.info/json/ethgasAPI.json'
  // const errMsg = 'Error querying gas station'
  const { data } = await axios.get(url)

  return new BigNumber(data.average).multipliedBy(1e8).toString()
}

export const calculateGasOf = async (data, from, to) => {
  const web3 = getWeb3()
  try {
    const gas = await web3.eth.estimateGas({ data, from, to })

    return gas * 2
  } catch (err) {
    return Promise.reject(err)
  }
}
