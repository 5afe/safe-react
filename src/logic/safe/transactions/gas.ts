import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { BigNumber } from 'bignumber.js'
import { AbiItem } from 'web3-utils'

import { CALL } from '.'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA, calculateGasOf, calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { getAccountFrom, getWeb3 } from 'src/logic/wallets/getWeb3'
import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { sameString } from 'src/utils/strings'

const estimateDataGasCosts = (data: string): number => {
  const reducer = (accumulator, currentValue) => {
    if (currentValue === EMPTY_DATA) {
      return accumulator + 0
    }

    if (currentValue === '00') {
      return accumulator + 4
    }

    return accumulator + 16
  }

  return data.match(/.{2}/g)?.reduce(reducer, 0)
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

    if (!from) {
      return 0
    }

    const safeInstance = (new web3.eth.Contract(GnosisSafeSol.abi as AbiItem[], safeAddress) as unknown) as GnosisSafe
    const nonce = await safeInstance.methods.nonce().call()
    const threshold = await safeInstance.methods.getThreshold().call()
    const isExecution = tx?.confirmations.size === Number(threshold) || !!preApprovingOwner || threshold === '1'

    let txData
    if (isExecution) {
      // https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
      const signatures = tx?.confirmations
        ? generateSignaturesFromTxConfirmations(tx.confirmations, preApprovingOwner)
        : `0x000000000000000000000000${from.replace(
            EMPTY_DATA,
            '',
          )}000000000000000000000000000000000000000000000000000000000000000001`
      txData = await safeInstance.methods
        .execTransaction(
          to,
          tx?.value || 0,
          data,
          CALL,
          tx?.safeTxGas || 0,
          0,
          0,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          signatures,
        )
        .encodeABI()
    } else {
      const txHash = await safeInstance.methods
        .getTransactionHash(to, tx?.value || 0, data, CALL, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, nonce)
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

const getGasEstimationTxResponse = (txConfig: {
  to: string
  from: string
  data: string
}): Promise<{ gasEstimationResponse: string; isGethNode: boolean }> => {
  const web3 = getWeb3()
  return web3.eth
    .call(txConfig)
    .then((result) => {
      // GETH Nodes
      // When we calculate the gas we always got the result as response for GETH Nodes
      // In case that the gas is not enough we will receive an EMPTY data
      // Otherwise we will receive the gas amount

      if (sameString(result, EMPTY_DATA)) {
        // We throw if there is an error
        throw new Error('There was an error retrieving the gas estimation')
      }
      return {
        gasEstimationResponse: result,
        isGethNode: true,
      }
    })
    .catch((error) => {
      // Non geth nodes
      // When we calculate the gas for Non GETH nodes we will always receive the response as error
      // In that case we check if there is empty data (which means an error)
      // Or if there is a valid estimation amount
      const estimationData = getNonGethErrorDataResult(error.message)

      if (!estimationData || sameString(estimationData, EMPTY_DATA)) {
        throw error
      }

      return {
        gasEstimationResponse: estimationData,
        isGethNode: false,
      }
    })
}

const calculateGasForGethNodes = async (
  additionalGasBatches: number[],
  safeAddress: string,
  estimateData: string,
  txGasEstimation: number,
  dataGasEstimation: number,
): Promise<number> => {
  const web3 = getWeb3()
  const batch = new web3.BatchRequest()
  const estimationRequests = additionalGasBatches.map(
    (additionalGas) =>
      new Promise((resolve) => {
        // there are no type definitions for .request, so for now ts-ignore is there
        // Issue link: https://github.com/ethereum/web3.js/issues/3144
        // eslint-disable-next-line
        // @ts-ignore
        const request = web3.eth.call.request(
          {
            to: safeAddress,
            from: safeAddress,
            data: estimateData,
            gasPrice: 0,
            gasLimit: txGasEstimation + dataGasEstimation + additionalGas,
          },
          (error, res) => {
            // res.data check is for OpenEthereum/Parity revert messages format
            const isOpenEthereumRevertMsg = res && typeof res.data === 'string'
            const isEstimationSuccessful =
              !error &&
              ((typeof res === 'string' && res !== EMPTY_DATA) ||
                (isOpenEthereumRevertMsg && res.data.slice(9) !== EMPTY_DATA))

            resolve({
              success: isEstimationSuccessful,
              estimation: txGasEstimation + additionalGas,
            })
          },
        )

        batch.add(request)
      }),
  )
  batch.execute()

  const estimationResponses = await Promise.all(estimationRequests)
  const firstSuccessfulRequest: any = estimationResponses.find((res: any) => res.success)

  if (firstSuccessfulRequest) {
    return firstSuccessfulRequest.estimation
  }
  return 0
}

const getNonGethErrorDataResult = (errorMessage: string): string | undefined => {
  // Extracts JSON object from the error message
  const [, ...error] = errorMessage.split('\n')
  const errorAsJSON = JSON.parse(error.join(''))

  if (errorAsJSON?.data) {
    const [, dataResult] = errorAsJSON.data.split('Reverted ')
    return dataResult
  }
}

const calculateGasForNonGethNodes = async (
  additionalGasBatches: number[],
  safeAddress: string,
  estimateData: string,
  txGasEstimation: number,
  dataGasEstimation: number,
): Promise<number> => {
  const web3 = getWeb3()
  for (const additionalGasIterator of additionalGasBatches) {
    try {
      await web3.eth.call({
        to: safeAddress,
        from: safeAddress,
        data: estimateData,
        gasPrice: 0,
        // `gasLimit` is not recognised on NON-GETH nodes, so we use json-rpc standard  `gas` instead
        gas: txGasEstimation + dataGasEstimation + additionalGasIterator,
      })
    } catch (error) {
      // NON-GETH nodes will always fail for this call, so we extract the return data from within the error
      const dataResult = getNonGethErrorDataResult(error.message)

      if (sameString(dataResult, EMPTY_DATA)) {
        throw error
      }
      return txGasEstimation + additionalGasIterator
    }
  }
  return 0
}
export const estimateSafeTxGas = async (
  safe: GnosisSafe | undefined,
  safeAddress: string,
  data: string,
  to: string,
  valueInWei: string,
  operation: number,
): Promise<number> => {
  try {
    let safeInstance = safe
    if (!safeInstance) {
      safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    }

    const estimateData = safeInstance.methods.requiredTxGas(to, valueInWei, data, operation).encodeABI()
    const { isGethNode, gasEstimationResponse } = await getGasEstimationTxResponse({
      to: safeAddress,
      from: safeAddress,
      data: estimateData,
    })

    const txGasEstimation = new BigNumber(gasEstimationResponse.substring(138), 16).toNumber() + 10000

    // 21000 - additional gas costs (e.g. base tx costs, transfer costs)
    const dataGasEstimation = estimateDataGasCosts(estimateData) + 21000
    const additionalGasBatches = [0, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000]

    if (isGethNode) {
      return await calculateGasForGethNodes(
        additionalGasBatches,
        safeAddress,
        estimateData,
        txGasEstimation,
        dataGasEstimation,
      )
    } else {
      return await calculateGasForNonGethNodes(
        additionalGasBatches,
        safeAddress,
        estimateData,
        txGasEstimation,
        dataGasEstimation,
      )
    }
  } catch (error) {
    console.error('Error calculating tx gas estimation', error)
    return 0
  }
}
