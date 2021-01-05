import { BigNumber } from 'bignumber.js'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { sameString } from 'src/utils/strings'

// Receives the response data of the safe method requiredTxGas() and parses it to get the gas amount
const parseRequiredTxGasResponse = (data: string): number => {
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

// https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
export const getPreValidatedSignatures = (from: string): string => {
  return `0x000000000000000000000000${from.replace(
    EMPTY_DATA,
    '',
  )}000000000000000000000000000000000000000000000000000000000000000001`
}

// Parses the result from the error message (GETH, OpenEthereum/Parity and Nethermind) and returns the data value
export const getDataFromNodeErrorMessage = (errorMessage: string): string | undefined => {
  // Replace illegal characters that often comes within the error string (like � for example)
  // https://stackoverflow.com/questions/12754256/removing-invalid-characters-in-javascript
  const normalizedErrorString = errorMessage.replace(/\uFFFD/g, '')

  // Extracts JSON object from the error message
  const [, ...error] = normalizedErrorString.split('\n')

  try {
    const errorAsJSON = JSON.parse(error.join(''))

    // For new GETH nodes they will return the data as error in the format:
    // {
    //   "originalError": {
    //     "code": number,
    //     "data": string,
    //     "message": "execution reverted: ..."
    //   }
    // }
    if (errorAsJSON.originalError && errorAsJSON.originalError.data) {
      return errorAsJSON.originalError.data
    }

    // OpenEthereum/Parity nodes will return the data as error in the format:
    // {
    //     "error": {
    //         "code": number,
    //         "message": string,
    //         "data": "revert: 0x..." -> this is the result data that should be extracted from the message
    //      },
    //     "id": number
    // }
    if (errorAsJSON?.data) {
      const [, dataResult] = errorAsJSON.data.split(' ')
      return dataResult
    }
  } catch (error) {
    console.error(`Error trying to extract data from node error message: ${errorMessage}`)
  }
}

export const getGasEstimationTxResponse = async (txConfig: {
  to: string
  from: string
  data: string
  gasPrice?: number
  gas?: number
}): Promise<number> => {
  const web3 = getWeb3()
  try {
    const result = await web3.eth.call(txConfig)

    // GETH Nodes (geth version < v1.9.24)
    // In case that the gas is not enough we will receive an EMPTY data
    // Otherwise we will receive the gas amount as hash data -> this is valid for old versions of GETH nodes ( < v1.9.24)

    if (!sameString(result, EMPTY_DATA)) {
      return new BigNumber(result.substring(138), 16).toNumber()
    }
  } catch (error) {
    // So we try to extract the estimation result within the error in case is possible
    const estimationData = getDataFromNodeErrorMessage(error.message)

    if (!estimationData || sameString(estimationData, EMPTY_DATA)) {
      throw error
    }

    return new BigNumber(estimationData.substring(138), 16).toNumber()
  }

  // This will fail in case that we receive an EMPTY_DATA on the GETH node gas estimation (for version < v1.9.24 of geth nodes)
  // We cannot throw this error above because it will be captured again on the catch block bellow
  throw new Error('Error while estimating the gas required for tx')
}

const calculateMinimumGasForTransaction = async (
  additionalGasBatches: number[],
  safeAddress: string,
  estimateData: string,
  txGasEstimation: number,
  dataGasEstimation: number,
): Promise<number> => {
  for (const additionalGas of additionalGasBatches) {
    const amountOfGasToTryTx = txGasEstimation + dataGasEstimation + additionalGas
    try {
      await getGasEstimationTxResponse({
        to: safeAddress,
        from: safeAddress,
        data: estimateData,
        gasPrice: 0,
        gas: amountOfGasToTryTx,
      })
      return txGasEstimation + additionalGas
    } catch (error) {
      console.log(`Error trying to estimate gas with amount: ${amountOfGasToTryTx}`)
    }
  }

  return 0
}

export const estimateGasForTransactionCreation = async (
  safeAddress: string,
  data: string,
  to: string,
  valueInWei: string,
  operation: number,
): Promise<number> => {
  try {
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)

    const estimateData = safeInstance.methods.requiredTxGas(to, valueInWei, data, operation).encodeABI()
    const gasEstimationResponse = await getGasEstimationTxResponse({
      to: safeAddress,
      from: safeAddress,
      data: estimateData,
    })

    const txGasEstimation = gasEstimationResponse + 10000

    // 21000 - additional gas costs (e.g. base tx costs, transfer costs)
    const dataGasEstimation = parseRequiredTxGasResponse(estimateData) + 21000
    const additionalGasBatches = [0, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000]

    return await calculateMinimumGasForTransaction(
      additionalGasBatches,
      safeAddress,
      estimateData,
      txGasEstimation,
      dataGasEstimation,
    )
  } catch (error) {
    console.info('Error calculating tx gas estimation', error.message)
    return 0
  }
}
