import { useEffect, useState } from 'react'
import { estimateTransactionGas } from 'src/logic/safe/transactions/gas'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { getNetworkInfo } from 'src/config'
import { useSelector } from 'react-redux'
import { safeParamAddressFromStateSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'

export enum EstimationStatus {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

const checkIfTxIsExecution = (threshold: number, preApprovingOwner?: string, txConfirmations?: number): boolean =>
  txConfirmations === threshold || !!preApprovingOwner || threshold === 1

type UseEstimateTransactionGasProps = {
  txData: string
  txRecipient: string
  txConfirmations?: number
  txAmount?: string
  preApprovingOwner?: string
  operation?: number
}

type TransactionGasEstimationResult = {
  txEstimationExecutionStatus: EstimationStatus
  gasEstimation: number // Amount of gas needed for execute or approve the transaction
  gasCost: string // Cost of gas in raw format (estimatedGas * gasPrice)
  gasCostFormatted: string // Cost of gas in format '< | > 100'
  gasPrice: string // Current price of gas unit
  isExecution: boolean // Returns true if the user will execute the tx or false if it just signs it
}

export const useEstimateTransactionGas = ({
  txRecipient,
  txData,
  txConfirmations,
  txAmount,
  preApprovingOwner,
  operation,
}: UseEstimateTransactionGasProps): TransactionGasEstimationResult => {
  const [gasEstimation, setGasEstimation] = useState<TransactionGasEstimationResult>({
    txEstimationExecutionStatus: EstimationStatus.LOADING,
    gasEstimation: 0,
    gasCost: '0',
    gasCostFormatted: '< 0.001',
    gasPrice: '0',
    isExecution: false,
  })
  const { nativeCoin } = getNetworkInfo()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const threshold = useSelector(safeThresholdSelector)

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      if (!txData.length) {
        return
      }

      try {
        const isExecution = checkIfTxIsExecution(Number(threshold), preApprovingOwner, txConfirmations)

        const gasEstimation = await estimateTransactionGas({
          safeAddress,
          txRecipient,
          txData,
          txAmount,
          isExecution,
          operation,
        })
        const gasPrice = await calculateGasPrice()
        const estimatedGasCosts = gasEstimation * parseInt(gasPrice, 10)
        const gasCost = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
        const gasCostFormatted = formatAmount(gasCost)
        if (isCurrent) {
          setGasEstimation({
            txEstimationExecutionStatus: gasEstimation <= 0 ? EstimationStatus.FAILURE : EstimationStatus.SUCCESS,
            gasEstimation,
            gasCost,
            gasCostFormatted,
            gasPrice,
            isExecution,
          })
        }
      } catch (error) {
        // We put a fixed the amount of gas to let the user try to execute the tx, but it's not accurate so it will probably fail
        const gasEstimation = 10000
        const gasCost = fromTokenUnit(gasEstimation, nativeCoin.decimals)
        const gasCostFormatted = formatAmount(gasCost)
        setGasEstimation({
          txEstimationExecutionStatus: EstimationStatus.FAILURE,
          gasEstimation,
          gasCost,
          gasCostFormatted,
          gasPrice: '1',
          isExecution: false,
        })
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [txData, safeAddress, txRecipient, txConfirmations, txAmount, preApprovingOwner, nativeCoin.decimals, threshold])

  return gasEstimation
}
