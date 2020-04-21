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

    return accumulator + 16
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

    const web3 = await getWeb3()
    const estimateData = safeInstance.contract.methods.requiredTxGas(to, valueInWei, data, operation).encodeABI()
    const estimateResponse = await web3.eth.call({
      to: safeAddress,
      from: safeAddress,
      data: estimateData,
    })
    const txGasEstimation = new BigNumber(estimateResponse.substring(138), 16).toNumber() + 10000

    // 21000 - additional gas costs (e.g. base tx costs, transfer costs)
    const dataGasEstimation = estimateDataGasCosts(estimateData) + 21000

    const additionalGasBatches = [10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000]

    const batch = new web3.BatchRequest()
    const estimationRequests = additionalGasBatches.map(
      (additionalGas) =>
        new Promise((resolve) => {
          const request = web3.eth.call.request(
            {
              to: safe.address,
              from: safe.address,
              data: estimateData,
              gasPrice: 0,
              gasLimit: txGasEstimation + dataGasEstimation + additionalGas,
            },
            (error, res) => {
              resolve({
                success: error || res === '0x' ? false : true,
                estimation: txGasEstimation + additionalGas,
              })
            },
          )

          batch.add(request)
        }),
    )
    batch.execute()

    const estimationResponses = await Promise.all(estimationRequests)
    const firstSuccessfulRequest = estimationResponses.find((res) => res.success)

    if (firstSuccessfulRequest) {
      return firstSuccessfulRequest.estimation
    }

    return 0
  } catch (error) {
    console.error('Error calculating tx gas estimation', error)
    return 0
  }
}
