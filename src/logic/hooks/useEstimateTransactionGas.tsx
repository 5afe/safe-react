import { useEffect, useState } from 'react'
import { estimateTransactionGas } from 'src/logic/safe/transactions/gas'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { getNetworkInfo } from 'src/config'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'

export enum EstimationStatus {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

type TransactionGasEstimationResult = {
  txEstimationExecutionStatus: EstimationStatus
  estimatedGas: number // Amount of gas needed for execute or approve the transaction
  gasCosts: string // Cost of gas to the user (estimatedGas * gasPrice) in format '< | > 100'
  isExecution: boolean // Returns true if the user will execute the tx or false if it just signs it
}

const checkIfTxIsExecution = (threshold: number, preApprovingOwner?: string, txConfirmations?: number): boolean =>
  txConfirmations === threshold || !!preApprovingOwner || threshold === 1

type UseEstimateTransactionGasProps = {
  txData: string
  safeAddress: string
  txRecipient: string
  txConfirmations?: number
  txAmount?: string
  preApprovingOwner?: string
}

export const useEstimateTransactionGas = ({
  safeAddress,
  txRecipient,
  txData,
  txConfirmations,
  txAmount,
  preApprovingOwner,
}: UseEstimateTransactionGasProps): TransactionGasEstimationResult => {
  const [gasCosts, setGasCosts] = useState({
    txEstimationExecutionStatus: EstimationStatus.LOADING,
    estimatedGas: 0,
    gasCosts: '< 0.001',
    isExecution: false,
  })
  const { nativeCoin } = getNetworkInfo()

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      if (!txData.length) {
        return
      }

      try {
        const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
        const threshold = await safeInstance.methods.getThreshold().call()
        const isExecution = checkIfTxIsExecution(Number(threshold), preApprovingOwner, txConfirmations)

        const estimatedGas = await estimateTransactionGas({
          safeAddress,
          txRecipient,
          txData,
          txAmount,
          isExecution,
        })
        const gasPrice = await calculateGasPrice()
        const estimatedGasCosts = estimatedGas * parseInt(gasPrice, 10)
        const gasCosts = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
        const formattedGasCosts = formatAmount(gasCosts)
        if (isCurrent) {
          setGasCosts({
            txEstimationExecutionStatus: estimatedGas <= 0 ? EstimationStatus.FAILURE : EstimationStatus.SUCCESS,
            estimatedGas,
            gasCosts: formattedGasCosts,
            isExecution,
          })
        }
      } catch (error) {
        // We put a fixed the amount of gas to let the user try to execute the tx, but it's not accurate so it will probably fail
        const estimatedGas = 10000
        const gasCosts = fromTokenUnit(estimatedGas, nativeCoin.decimals)
        const formattedGasCosts = formatAmount(gasCosts)
        setGasCosts({
          txEstimationExecutionStatus: EstimationStatus.FAILURE,
          estimatedGas,
          gasCosts: formattedGasCosts,
          isExecution: false,
        })
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [txData, safeAddress, txRecipient, txConfirmations, txAmount, preApprovingOwner, nativeCoin.decimals])

  return gasCosts
}
