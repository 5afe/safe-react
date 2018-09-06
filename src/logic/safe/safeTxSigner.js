// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import { BigNumber } from 'bignumber.js'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getSignaturesFrom } from '~/utils/localStorage/signatures'

const estimateDataGasCosts = (data) => {
  const reducer = (accumulator, currentValue) => {
    if (currentValue === EMPTY_DATA) {
      return accumulator + 0
    }

    if (currentValue === '00') {
      return accumulator + 4
    }

    return accumulator + 68
  }

  return data.match(/.{2}/g).reduce(reducer, 0)
}


export const estimateDataGas = (
  safe: any,
  to: string,
  valueInWei: number,
  data: string,
  operation: number,
  txGasEstimate: number,
  gasToken: number,
  nonce: number,
  signatureCount: number,
) => {
  // numbers < 256 are 192 -> 31 * 4 + 68
  // numbers < 65k are 256 -> 30 * 4 + 2 * 68
  // For signature array length and dataGasEstimate we already calculated
  // the 0 bytes so we just add 64 for each non-zero byte
  const gasPrice = 0 // no need to get refund when we submit txs to metamask
  const signatureCost = signatureCount * (68 + 2176 + 2176) // array count (3 -> r, s, v) * signature count

  const sigs = getSignaturesFrom(safe.address, nonce)
  const payload = safe.contract.execTransactionAndPaySubmitter
    .getData(to, valueInWei, data, operation, txGasEstimate, 0, gasPrice, gasToken, sigs)

  let dataGasEstimate = estimateDataGasCosts(payload) + signatureCost
  if (dataGasEstimate > 65536) {
    dataGasEstimate += 64
  } else {
    dataGasEstimate += 128
  }
  return dataGasEstimate + 34000 // Add aditional gas costs (e.g. base tx costs, transfer costs)
}

// eslint-disable-next-line
export const generateTxGasEstimateFrom = async (
  safe: any,
  safeAddress: string,
  data: string,
  to: string,
  valueInWei: number,
  operation: number,
) => {
  try {
    const estimateData = safe.contract.requiredTxGas.getData(to, valueInWei, data, operation)
    const estimateResponse = await promisify(cb => getWeb3().eth.call({
      to: safeAddress,
      from: safeAddress,
      data: estimateData,
    }, cb))
    const txGasEstimate = new BigNumber(estimateResponse.substring(138), 16)

    // Add 10k else we will fail in case of nested calls
    return Promise.resolve(txGasEstimate.toNumber() + 10000)
  } catch (error) {
    // eslint-disable-next-line
    console.log("Error calculating tx gas estimation " + error)
    return Promise.resolve(0)
  }
}

const generateTypedDataFrom = async (
  safe: any,
  safeAddress: string,
  to: string,
  valueInWei: number,
  nonce: number,
  data: string,
  operation: number,
  txGasEstimate: number,
) => {
  const txGasToken = 0
  // const threshold = await safe.getThreshold()
  // estimateDataGas(safe, to, valueInWei, data, operation, txGasEstimate, txGasToken, nonce, threshold)
  const dataGasEstimate = 0
  const gasPrice = 0
  const typedData = {
    types: {
      EIP712Domain: [
        {
          type: 'address',
          name: 'verifyingContract',
        },
      ],
      PersonalSafeTx: [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'value' },
        { type: 'bytes', name: 'data' },
        { type: 'uint8', name: 'operation' },
        { type: 'uint256', name: 'safeTxGas' },
        { type: 'uint256', name: 'dataGas' },
        { type: 'uint256', name: 'gasPrice' },
        { type: 'address', name: 'gasToken' },
        { type: 'uint256', name: 'nonce' },
      ],
    },
    domain: {
      verifyingContract: safeAddress,
    },
    primaryType: 'PersonalSafeTx',
    message: {
      to,
      value: valueInWei,
      data,
      operation,
      safeTxGas: txGasEstimate,
      dataGas: dataGasEstimate,
      gasPrice,
      gasToken: txGasToken,
      nonce,
    },
  }

  return typedData
}

export const generateMetamaskSignature = async (
  safe: any,
  safeAddress: string,
  sender: string,
  to: string,
  valueInWei: number,
  nonce: number,
  data: string,
  operation: number,
  txGasEstimate: number,
) => {
  const web3 = getWeb3()
  const typedData =
    await generateTypedDataFrom(safe, safeAddress, to, valueInWei, nonce, data, operation, txGasEstimate)
  const signedTypedData = {
    jsonrpc: '2.0',
    method: 'eth_signTypedData',
    params: [sender, typedData],
    id: Date.now(),
  }
  const txSignedResponse = await promisify(cb => web3.currentProvider.sendAsync(signedTypedData, cb))

  return txSignedResponse.result.replace(EMPTY_DATA, '')
}
