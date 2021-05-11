import { List } from 'immutable'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getNetworkInfo } from 'src/config'
import {
  checkTransactionExecution,
  estimateSafeTxGas,
  estimateTransactionGasLimit,
} from 'src/logic/safe/transactions/gas'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import {
  safeCurrentVersionSelector,
  safeParamAddressFromStateSelector,
  safeThresholdSelector,
} from 'src/logic/safe/store/selectors'
import { CALL } from 'src/logic/safe/transactions'
import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { providerSelector } from 'src/logic/wallets/store/selectors'

import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { checkIfOffChainSignatureIsPossible } from 'src/logic/safe/safeTxSigner'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { sameString } from 'src/utils/strings'

export enum EstimationStatus {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

export const checkIfTxIsExecution = (
  threshold: number,
  preApprovingOwner?: string,
  txConfirmations?: number,
  txType?: string,
): boolean => {
  if (
    threshold === 1 ||
    sameString(txType, 'spendingLimit') ||
    (txConfirmations !== undefined && txConfirmations >= threshold)
  ) {
    return true
  }

  if (preApprovingOwner && txConfirmations) {
    return txConfirmations + 1 === threshold
  }

  return false
}

export const checkIfTxIsApproveAndExecution = (
  threshold: number,
  txConfirmations: number,
  txType?: string,
  preApprovingOwner?: string,
): boolean => {
  if (preApprovingOwner) {
    return txConfirmations + 1 === threshold || sameString(txType, 'spendingLimit')
  }

  if (threshold === 1) {
    return true
  }

  return false
}

export const checkIfTxIsCreation = (txConfirmations: number, txType?: string): boolean =>
  txConfirmations === 0 && !sameString(txType, 'spendingLimit')

type UseEstimateTransactionGasProps = {
  txData: string
  txRecipient: string
  txConfirmations?: List<Confirmation>
  txAmount?: string
  preApprovingOwner?: string
  operation?: number
  safeTxGas?: number
  txType?: string
  manualGasPrice?: string
  manualGasLimit?: string
}

export type TransactionGasEstimationResult = {
  txEstimationExecutionStatus: EstimationStatus
  gasEstimation: number // Amount of gas needed for execute or approve the transaction
  gasCost: string // Cost of gas in raw format (estimatedGas * gasPrice)
  gasCostFormatted: string // Cost of gas in format '< | > 100'
  gasPrice: string // Current price of gas unit
  gasPriceFormatted: string // Current gas price formatted
  gasLimit: string // Minimum gas requited to execute the Tx
  isExecution: boolean // Returns true if the user will execute the tx or false if it just signs it
  isCreation: boolean // Returns true if the transaction is a creation transaction
  isOffChainSignature: boolean // Returns true if offChainSignature is available
}

export const useEstimateTransactionGas = ({
  txRecipient,
  txData,
  txConfirmations,
  txAmount,
  preApprovingOwner,
  operation,
  safeTxGas,
  txType,
  manualGasPrice,
  manualGasLimit,
}: UseEstimateTransactionGasProps): TransactionGasEstimationResult => {
  const [gasEstimation, setGasEstimation] = useState<TransactionGasEstimationResult>({
    txEstimationExecutionStatus: EstimationStatus.LOADING,
    gasEstimation: 0,
    gasCost: '0',
    gasCostFormatted: '< 0.001',
    gasPrice: '0',
    gasPriceFormatted: '0',
    gasLimit: '0',
    isExecution: false,
    isCreation: false,
    isOffChainSignature: false,
  })
  const { nativeCoin } = getNetworkInfo()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const threshold = useSelector(safeThresholdSelector)
  const safeVersion = useSelector(safeCurrentVersionSelector)
  const { account: from, smartContractWallet, name: providerName } = useSelector(providerSelector)

  useEffect(() => {
    const estimateGas = async () => {
      if (!txData.length) {
        return
      }

      const isCreation = checkIfTxIsCreation(txConfirmations?.size || 0, txType)
      const isExecution = checkIfTxIsExecution(Number(threshold), preApprovingOwner, txConfirmations?.size, txType)
      const approvalAndExecution = checkIfTxIsApproveAndExecution(
        Number(threshold),
        txConfirmations?.size || 0,
        txType,
        preApprovingOwner,
      )
      const isOffChainSignature = checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)

      try {
        let safeTxGasEstimation = safeTxGas || 0
        let ethGasLimitEstimation = 0
        let transactionCallSuccess = true
        let txEstimationExecutionStatus = EstimationStatus.LOADING

        if (isCreation) {
          safeTxGasEstimation = await estimateSafeTxGas({
            safeAddress,
            txData,
            txRecipient,
            txAmount: txAmount || '0',
            operation: operation || CALL,
          })
        }
        if (isExecution || approvalAndExecution) {
          ethGasLimitEstimation = await estimateTransactionGasLimit({
            safeAddress,
            txRecipient,
            txData,
            txAmount: txAmount || '0',
            txConfirmations,
            isExecution,
            isOffChainSignature,
            operation: operation || CALL,
            from,
            safeTxGas: safeTxGasEstimation,
            approvalAndExecution,
          })
        }

        const gasPrice = manualGasPrice ? web3.utils.toWei(manualGasPrice, 'gwei') : await calculateGasPrice()
        const gasPriceFormatted = web3.utils.fromWei(gasPrice, 'gwei')
        const estimatedGasCosts = ethGasLimitEstimation * parseInt(gasPrice, 10)
        const gasCost = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
        const gasCostFormatted = formatAmount(gasCost)
        const gasLimit = manualGasLimit || ethGasLimitEstimation.toString()

        if (isExecution) {
          transactionCallSuccess = await checkTransactionExecution({
            safeAddress,
            txRecipient,
            txData,
            txAmount: txAmount || '0',
            txConfirmations,
            operation: operation || CALL,
            from,
            gasPrice: '0',
            gasToken: ZERO_ADDRESS,
            gasLimit,
            refundReceiver: ZERO_ADDRESS,
            safeTxGas: safeTxGasEstimation,
            approvalAndExecution,
          })
        }

        txEstimationExecutionStatus = transactionCallSuccess ? EstimationStatus.SUCCESS : EstimationStatus.FAILURE

        setGasEstimation({
          txEstimationExecutionStatus,
          gasEstimation: safeTxGasEstimation,
          gasCost,
          gasCostFormatted,
          gasPrice,
          gasPriceFormatted,
          gasLimit,
          isExecution,
          isCreation,
          isOffChainSignature,
        })
      } catch (error) {
        console.warn(error.message)
        // If safeTxGas estimation fail we set this value to 0 (so up to all gasLimit can be used)
        setGasEstimation({
          txEstimationExecutionStatus: EstimationStatus.FAILURE,
          gasEstimation: 0,
          gasCost: '0',
          gasCostFormatted: '< 0.001',
          gasPrice: '1',
          gasPriceFormatted: '1',
          gasLimit: '0',
          isExecution,
          isCreation,
          isOffChainSignature,
        })
      }
    }

    estimateGas()
  }, [
    txData,
    safeAddress,
    txRecipient,
    txConfirmations,
    txAmount,
    preApprovingOwner,
    nativeCoin.decimals,
    threshold,
    from,
    operation,
    safeVersion,
    smartContractWallet,
    safeTxGas,
    txType,
    providerName,
    manualGasPrice,
    manualGasLimit,
  ])

  return gasEstimation
}
