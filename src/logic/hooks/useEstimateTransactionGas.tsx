import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { List } from 'immutable'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fromWei, toWei } from 'web3-utils'

import { getNativeCurrency } from 'src/config'
import {
  checkTransactionExecution,
  estimateSafeTxGas,
  estimateTransactionGasLimit,
  isMaxFeeParam,
} from 'src/logic/safe/transactions/gas'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { checkIfOffChainSignatureIsPossible } from 'src/logic/safe/safeTxSigner'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { isSpendingLimit } from 'src/routes/safe/components/Transactions/helpers/utils'
import useCanTxExecute from './useCanTxExecute'

export enum EstimationStatus {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

const DEFAULT_MAX_GAS_FEE = String(3.5e9) // 3.5 GWEI
const DEFAULT_MAX_PRIO_FEE = String(2.5e9) // 2.5 GWEI

export const checkIfTxIsApproveAndExecution = (
  threshold: number,
  txConfirmations: number,
  txType?: string,
  preApprovingOwner?: string,
): boolean => {
  if (preApprovingOwner) {
    return txConfirmations + 1 === threshold || isSpendingLimit(txType)
  }

  return threshold === 1
}

export const checkIfTxIsCreation = (txConfirmations: number, txType?: string): boolean =>
  txConfirmations === 0 && !isSpendingLimit(txType)

type UseEstimateTransactionGasProps = {
  txData: string
  txRecipient: string
  txConfirmations?: List<Confirmation>
  txAmount?: string
  preApprovingOwner?: string
  operation?: number
  safeTxGas?: string
  txType?: string
  manualGasPrice?: string
  manualMaxPrioFee?: string
  manualGasLimit?: string
  manualSafeNonce?: number // Edited nonce
  isExecution?: boolean // If called from the TransactionList "next transaction"
}

export type TransactionGasEstimationResult = {
  txEstimationExecutionStatus: EstimationStatus
  gasEstimation: string // Amount of gas needed for execute or approve the transaction
  gasCost: string // Cost of gas in raw format (estimatedGas * gasPrice)
  gasCostFormatted: string // Cost of gas in format '< | > 100'
  gasPrice: string // Current price of gas unit
  gasPriceFormatted: string // Current gas price formatted
  gasMaxPrioFee: string // Current max prio gas price
  gasMaxPrioFeeFormatted: string // Current max prio gas formatted
  gasLimit: string // Minimum gas requited to execute the Tx
  isCreation: boolean // Returns true if the transaction is a creation transaction
  isOffChainSignature: boolean // Returns true if offChainSignature is available
}

type DefaultGasEstimationParams = {
  txEstimationExecutionStatus: EstimationStatus
  gasPrice: string
  gasPriceFormatted: string
  gasMaxPrioFee: string
  gasMaxPrioFeeFormatted: string
  isCreation?: boolean
  isOffChainSignature?: boolean
}
const getDefaultGasEstimation = ({
  txEstimationExecutionStatus,
  gasPrice,
  gasPriceFormatted,
  gasMaxPrioFee,
  gasMaxPrioFeeFormatted,
  isCreation = false,
  isOffChainSignature = false,
}: DefaultGasEstimationParams): TransactionGasEstimationResult => {
  return {
    txEstimationExecutionStatus,
    gasEstimation: '0',
    gasCost: '0',
    gasCostFormatted: '< 0.001',
    gasPrice,
    gasPriceFormatted,
    gasMaxPrioFee,
    gasMaxPrioFeeFormatted,
    gasLimit: '0',
    isCreation,
    isOffChainSignature,
  }
}

export const calculateTotalGasCost = (
  gasLimit: string,
  gasPrice: string,
  gasMaxPrioFee: string,
  decimals: number,
): [string, string] => {
  const totalPricePerGas = parseFloat(gasPrice) + parseFloat(gasMaxPrioFee || '0')
  const estimatedGasCosts = parseInt(gasLimit, 10) * totalPricePerGas
  const gasCost = fromTokenUnit(estimatedGasCosts, decimals)
  const formattedGasCost = formatAmount(gasCost)
  return [gasCost, formattedGasCost]
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
  manualMaxPrioFee,
  manualGasLimit,
  manualSafeNonce,
  isExecution,
}: UseEstimateTransactionGasProps): TransactionGasEstimationResult => {
  const [gasEstimation, setGasEstimation] = useState<TransactionGasEstimationResult>(
    getDefaultGasEstimation({
      txEstimationExecutionStatus: EstimationStatus.LOADING,
      gasPrice: '0',
      gasPriceFormatted: '0',
      gasMaxPrioFee: '0',
      gasMaxPrioFeeFormatted: '0',
    }),
  )
  const nativeCurrency = getNativeCurrency()
  const { address: safeAddress = '', threshold = 1, currentVersion: safeVersion = '' } = useSelector(currentSafe) ?? {}
  const { account: from, smartContractWallet, name: providerName } = useSelector(providerSelector)

  const canTxExecute = useCanTxExecute(isExecution, manualSafeNonce, preApprovingOwner, txConfirmations?.size)

  useEffect(() => {
    const estimateGas = async () => {
      if (!txData.length) {
        return
      }
      const isOffChainSignature = checkIfOffChainSignatureIsPossible(canTxExecute, smartContractWallet, safeVersion)
      const isCreation = checkIfTxIsCreation(txConfirmations?.size || 0, txType)

      if (isOffChainSignature && !isCreation) {
        setGasEstimation(
          getDefaultGasEstimation({
            txEstimationExecutionStatus: EstimationStatus.SUCCESS,
            gasPrice: fromWei(DEFAULT_MAX_GAS_FEE, 'gwei'),
            gasPriceFormatted: DEFAULT_MAX_GAS_FEE,
            gasMaxPrioFee: fromWei(DEFAULT_MAX_PRIO_FEE, 'gwei'),
            gasMaxPrioFeeFormatted: DEFAULT_MAX_PRIO_FEE,
            isCreation,
            isOffChainSignature,
          }),
        )
        return
      }
      const approvalAndExecution = checkIfTxIsApproveAndExecution(
        Number(threshold),
        txConfirmations?.size || 0,
        txType,
        preApprovingOwner,
      )

      try {
        let safeTxGasEstimation = safeTxGas || '0'
        let ethGasLimitEstimation = 0
        let transactionCallSuccess = true
        let txEstimationExecutionStatus = EstimationStatus.LOADING

        if (isCreation) {
          safeTxGasEstimation = await estimateSafeTxGas(
            {
              safeAddress,
              txData,
              txRecipient,
              txAmount: txAmount || '0',
              operation: operation || Operation.CALL,
            },
            safeVersion,
          )
        }

        if (canTxExecute || approvalAndExecution) {
          ethGasLimitEstimation = await estimateTransactionGasLimit({
            safeAddress,
            safeVersion,
            txRecipient,
            txData,
            txAmount: txAmount || '0',
            txConfirmations,
            isExecution: canTxExecute,
            operation: operation || Operation.CALL,
            from,
            safeTxGas: safeTxGasEstimation,
            approvalAndExecution,
          })
        }

        const gasPrice = manualGasPrice ? toWei(manualGasPrice, 'gwei') : await calculateGasPrice()
        const gasPriceFormatted = fromWei(gasPrice, 'gwei')
        const gasMaxPrioFee = isMaxFeeParam()
          ? manualMaxPrioFee
            ? toWei(manualMaxPrioFee, 'gwei')
            : DEFAULT_MAX_PRIO_FEE
          : '0'
        const gasMaxPrioFeeFormatted = fromWei(gasMaxPrioFee, 'gwei')
        const gasLimit = manualGasLimit || ethGasLimitEstimation.toString()
        const [gasCost, gasCostFormatted] = calculateTotalGasCost(
          gasLimit,
          gasPrice,
          gasMaxPrioFee,
          nativeCurrency.decimals,
        )

        if (canTxExecute) {
          transactionCallSuccess = await checkTransactionExecution({
            safeAddress,
            safeVersion,
            txRecipient,
            txData,
            txAmount: txAmount || '0',
            txConfirmations,
            operation: operation || Operation.CALL,
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
          gasMaxPrioFee,
          gasMaxPrioFeeFormatted,
          gasLimit,
          isCreation,
          isOffChainSignature,
        })
      } catch (error) {
        console.warn(error.message)
        // If safeTxGas estimation fail we set this value to 0 (so up to all gasLimit can be used)
        setGasEstimation(
          getDefaultGasEstimation({
            txEstimationExecutionStatus: EstimationStatus.FAILURE,
            gasPrice: DEFAULT_MAX_GAS_FEE,
            gasPriceFormatted: fromWei(DEFAULT_MAX_GAS_FEE, 'gwei'),
            gasMaxPrioFee: DEFAULT_MAX_PRIO_FEE,
            gasMaxPrioFeeFormatted: fromWei(DEFAULT_MAX_PRIO_FEE, 'gwei'),
          }),
        )
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
    nativeCurrency.decimals,
    threshold,
    from,
    operation,
    safeVersion,
    smartContractWallet,
    safeTxGas,
    txType,
    providerName,
    manualGasPrice,
    manualMaxPrioFee,
    manualGasLimit,
    manualSafeNonce,
    canTxExecute,
  ])

  return gasEstimation
}
