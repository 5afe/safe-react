// @flow
import { BigNumber } from 'bignumber.js'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getSafeEthereumInstance } from '../safeFrontendOperations'

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

// https://gnosis-safe.readthedocs.io/en/latest/contracts/transactions.html#safe-transaction-data-gas-estimation
// https://github.com/gnosis/safe-contracts/blob/a97c6fd24f79c0b159ddd25a10a2ebd3ea2ef926/test/utils/execution.js
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
  refundReceiver: number,
) => {
  // numbers < 256 are 192 -> 31 * 4 + 68
  // numbers < 65k are 256 -> 30 * 4 + 2 * 68
  // For signature array length and dataGasEstimate we already calculated
  // the 0 bytes so we just add 64 for each non-zero byte
  const gasPrice = 0 // no need to get refund when we submit txs to metamask
  const signatureCost = signatureCount * (68 + 2176 + 2176 + 6000) // array count (3 -> r, s, v) * signature count

  const sigs = `0x000000000000000000000000${'0xbc2BB26a6d821e69A38016f3858561a1D80d4182'.replace(
    '0x',
    '',
  )}0000000000000000000000000000000000000000000000000000000000000000`
  const payload = safe.contract.methods
    .execTransaction(to, valueInWei, data, operation, txGasEstimate, 0, gasPrice, gasToken, refundReceiver, sigs)
    .encodeABI()

  // eslint-disable-next-line
  const dataGasEstimate = estimateDataGasCosts(payload) + signatureCost + (nonce > 0 ? 5000 : 20000) + 1500 // 1500 -> hash generation costs

  return dataGasEstimate + 32000 // Add aditional gas costs (e.g. base tx costs, transfer costs)
}

export const generateTxGasEstimateFrom = async (
  safe: any,
  safeAddress: string,
  data: string,
  to: string,
  valueInWei: number,
  operation: number,
) => {
  try {
    let safeInstance = safe
    if (!safeInstance) {
      safeInstance = await getSafeEthereumInstance(safeAddress)
    }

    const estimateData = safeInstance.contract.methods.requiredTxGas(to, valueInWei, data, operation).encodeABI()
    const estimateResponse = await getWeb3().eth.call({
      to: safeAddress,
      from: safeAddress,
      data: estimateData,
    })
    const txGasEstimate = new BigNumber(estimateResponse.substring(138), 16)

    // Add 10k else we will fail in case of nested calls
    return txGasEstimate.toNumber() + 10000
  } catch (error) {
    // eslint-disable-next-line
    console.log('Error calculating tx gas estimation ' + error)
    return 0
  }
}

export const calculateTxFee = async (
  safe: any,
  safeAddress: string,
  from: string,
  data: string,
  to: string,
  valueInWei: number,
  operation: number,
) => {
  try {
    let safeInstance = safe
    if (!safeInstance) {
      safeInstance = await getSafeEthereumInstance(safeAddress)
    }

    // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
    const sigs = `0x000000000000000000000000${from.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`

    // we get gas limit from this call, then it needs to be multiplied by the gas price
    // https://safe-relay.gnosis.pm/api/v1/gas-station/
    // https://safe-relay.rinkeby.gnosis.pm/api/v1/about/
    const estimate = await safeInstance.execTransaction.estimateGas(
      to,
      valueInWei,
      data,
      operation,
      0,
      0,
      0,
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
      sigs,
      { from: '0xbc2BB26a6d821e69A38016f3858561a1D80d4182' },
    )

    return estimate
  } catch (error) {
    // eslint-disable-next-line
    console.log('Error calculating tx gas estimation ' + error)
    return 0
  }
}
