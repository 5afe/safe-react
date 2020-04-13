// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { BigNumber } from 'bignumber.js'

import { CALL } from '.'

import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { generateSignaturesFromTxConfirmations } from '~/logic/safe/safeTxSigner'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { EMPTY_DATA, calculateGasOf, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { getAccountFrom, getWeb3 } from '~/logic/wallets/getWeb3'
import { type Transaction } from '~/routes/safe/store/models/transaction'

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

export const estimateTxGasCosts = async (
  safeAddress: string,
  to: string,
  data: string,
  tx?: Transaction,
  preApprovingOwner?: string,
): Promise<number> => {
  try {
    const web3 = getWeb3()
    const from = await getAccountFrom(web3)
    const safeInstance = new web3.eth.Contract(GnosisSafeSol.abi, safeAddress)
    const nonce = await safeInstance.methods.nonce().call()
    const threshold = await safeInstance.methods.getThreshold().call()

    const isExecution = (tx && tx.confirmations.size === threshold) || !!preApprovingOwner || threshold === '1'

    let txData
    if (isExecution) {
      // https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
      const signatures =
        tx && tx.confirmations
          ? generateSignaturesFromTxConfirmations(tx.confirmations, preApprovingOwner)
          : `0x000000000000000000000000${from.replace(
              '0x',
              '',
            )}000000000000000000000000000000000000000000000000000000000000000001`
      txData = await safeInstance.methods
        .execTransaction(to, tx ? tx.value : 0, data, CALL, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, signatures)
        .encodeABI()
    } else {
      const txHash = await safeInstance.methods
        .getTransactionHash(to, tx ? tx.value : 0, data, CALL, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, nonce)
        .call({
          from,
        })
      txData = await safeInstance.methods.approveHash(txHash).encodeABI()
    }

    const gas = await calculateGasOf(txData, from, safeAddress)
    const gasPrice = await calculateGasPrice()

    return gas * parseInt(gasPrice, 10)
  } catch (err) {
    console.error('Error while estimating transaction execution gas costs:')
    console.error(err)

    return 10000
  }
}

// https://docs.gnosis.io/safe/docs/docs4/#safe-transaction-data-gas-estimation
// https://github.com/gnosis/safe-contracts/blob/a97c6fd24f79c0b159ddd25a10a2ebd3ea2ef926/test/utils/execution.js

export const estimateBaseGas = (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: number,
  txGasEstimate: number,
  gasToken: string,
  refundReceiver: string,
  signatureCount: number,
  nonce: number,
) => {
  // numbers < 256 are 192 -> 31 * 4 + 68
  // numbers < 65k are 256 -> 30 * 4 + 2 * 68
  // For signature array length and dataGasEstimate we already calculated
  // the 0 bytes so we just add 64 for each non-zero byte

  const gasPrice = 0 // no need to get refund when we submit txs to metamask
  const signatureCost = signatureCount * (68 + 2176 + 2176 + 6000) // array count (3 -> r, s, v) * signature count

  const payload = safeInstance.contract.methods
    .execTransaction(to, valueInWei, data, operation, txGasEstimate, 0, gasPrice, gasToken, refundReceiver, '0x')
    .encodeABI()

  // eslint-disable-next-line
  const dataGasEstimate = estimateDataGasCosts(payload) + signatureCost + (nonce > 0 ? 5000 : 20000) + 1500 // 1500 -> hash generation costs

  return dataGasEstimate + 32000 // Add additional gas costs (e.g. base tx costs, transfer costs)
}

export const estimateSafeTxGas = async (
  safe: any,
  safeAddress: string,
  data: string,
  to: string,
  valueInWei: number | string,
  operation: number,
) => {
  try {
    let additionalGasBatches = [10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000]
    let safeInstance = safe
    if (!safeInstance) {
      safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    }

    const web3 = await getWeb3()
    const nonce = await safeInstance.nonce()
    const threshold = await safeInstance.getThreshold()

    const estimateData = safeInstance.contract.methods.requiredTxGas(to, valueInWei, data, operation).encodeABI()
    const estimateResponse = await getWeb3().eth.call({
      to: safeAddress,
      from: safeAddress,
      data: estimateData,
    })
    let txGasEstimation = new BigNumber(estimateResponse.substring(138), 16).toNumber() + 10000

    const baseGasEstimation = estimateBaseGas(
      safeInstance,
      to,
      valueInWei,
      data,
      operation,
      txGasEstimation,
      ZERO_ADDRESS,
      ZERO_ADDRESS,
      threshold,
      nonce,
    )

    let additionalGas = 10000
    for (let i = 0; i < 100; i++) {
      try {
        let estimateData = safe.contract.methods.requiredTxGas(to, valueInWei, data, operation).encodeABI()
        let estimateResponse = await web3.eth.call({
          to: safe.address,
          from: safe.address,
          data: estimateData,
          gasPrice: 0,
          gasLimit: txGasEstimation + baseGasEstimation + 32000,
        })
        console.log('    Simulate: ' + estimateResponse)
        if (estimateResponse != '0x') break
      } catch (e) {
        console.error('Error calculating safeTxGas: ', e)
      }
      txGasEstimation += additionalGas
      additionalGas *= 2
    }

    return txGasEstimation + 10000
  } catch (error) {
    console.error('Error calculating tx gas estimation', error)
    return 0
  }
}
