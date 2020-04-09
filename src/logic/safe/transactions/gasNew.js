// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { BigNumber } from 'bignumber.js'

import { CALL } from '.'

import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { generateSignaturesFromTxConfirmations } from '~/logic/safe/safeTxSigner'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { calculateGasOf, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { getAccountFrom, getWeb3 } from '~/logic/wallets/getWeb3'
import { type Transaction } from '~/routes/safe/store/models/transaction'

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
        .execTransaction(
          to,
          tx ? tx.value : 0,
          data,
          CALL,
          tx ? tx.safeTxGas : 0,
          0,
          0,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          signatures,
        )
        .encodeABI()
    } else {
      const txHash = await safeInstance.methods
        .getTransactionHash(
          to,
          tx ? tx.value : 0,
          data,
          CALL,
          tx ? tx.safeTxGas : 0,
          0,
          0,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          nonce,
        )
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

export const estimateSafeTxGas = async (
  safe: any,
  safeAddress: string,
  data: string,
  to: string,
  valueInWei: number | string,
  operation: number,
) => {
  try {
    let safeInstance = safe
    if (!safeInstance) {
      safeInstance = await getGnosisSafeInstanceAt(safeAddress)
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
    console.error('Error calculating tx gas estimation', error)
    return 0
  }
}
