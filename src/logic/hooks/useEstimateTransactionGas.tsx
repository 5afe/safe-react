import { useEffect, useState } from 'react'
import { estimateTransactionGas, TransactionEstimationProps } from 'src/logic/safe/transactions/gas'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { getNetworkInfo } from 'src/config'

export enum EstimationStatus {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

type TransactionGasEstimationResult = {
  txEstimationExecutionStatus: EstimationStatus
  estimatedGas: number // Amount of gas needed for execute or approve the transaction
  gasCosts: string // Cost of gas to the user (estimatedGas * gasPrice) in format '< | > 100'
}

export const useEstimateTransactionGas = ({
  safeAddress,
  txRecipient,
  txData,
  txConfirmations,
  txAmount,
  preApprovingOwner,
}: TransactionEstimationProps): TransactionGasEstimationResult => {
  const [gasCosts, setGasCosts] = useState({
    txEstimationExecutionStatus: EstimationStatus.LOADING,
    estimatedGas: 0,
    gasCosts: '< 0.001',
  })
  const { nativeCoin } = getNetworkInfo()

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      if (!txData.length) {
        return
      }

      try {
        const estimatedGas = await estimateTransactionGas({
          safeAddress,
          txRecipient,
          txData,
          txConfirmations,
          txAmount,
          preApprovingOwner,
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
