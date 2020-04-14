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
    let additionalGasBatches = [10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000]
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
    let txGasEstimation = new BigNumber(estimateResponse.substring(138), 16).toNumber() + 10000

    let payload = safeInstance.contract.methods
      .execTransaction(to, valueInWei, data, operation, txGasEstimation, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, '0x')
      .encodeABI()
    // 21000 - additional gas costs (e.g. base tx costs, transfer costs)
    const dataGasEstimation = estimateDataGasCosts(payload) + 21000

    let additionalGas = 10000
    for (let i = 0; i < 10; i++) {
      // const batch = new web3.BatchRequest()

      // const request = web3.eth.call.request(
      //   {
      //     to: safe.address,
      //     from: safe.address,
      //     data: estimateData,
      //     gasPrice: 0,
      //     gasLimit: txGasEstimation + dataGasEstimation,
      //   },
      //   (error, estimateResponse) => {
      //     if (error) {
      //       // if there's no balance, we log the error, but `resolve` with a default '0'
      //       console.error('No balance method found', error)
      //       resolve('0')
      //     } else {
      //       resolve({
      //         address,
      //         estimateResponse,
      //       })
      //     }
      //   },
      // )

      // batch.add(request)

      try {
        let estimateResponse = await web3.eth.call({
          to: safe.address,
          from: safe.address,
          data: safeInstance.contract.methods
            .execTransaction(
              to,
              valueInWei,
              data,
              operation,
              txGasEstimation + dataGasEstimation,
              0,
              0,
              ZERO_ADDRESS,
              ZERO_ADDRESS,
              '0x',
            )
            .encodeABI(),
          gasPrice: 0,
          gasLimit: txGasEstimation + dataGasEstimation,
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
