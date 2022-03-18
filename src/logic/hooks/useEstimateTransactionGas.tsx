import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { List } from 'immutable'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fromWei, toWei } from 'web3-utils'

import { getNativeCurrency } from 'src/config'
import {
  checkTransactionExecution,
  estimateGasForTransactionExecution,
  isMaxFeeParam,
} from 'src/logic/safe/transactions/gas'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import {
  calculateGasPrice,
  setMaxPrioFeePerGas,
  getFeesPerGas,
  DEFAULT_MAX_GAS_FEE,
  DEFAULT_MAX_PRIO_FEE,
} from 'src/logic/wallets/ethTransactions'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

export enum EstimationStatus {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

type UseEstimateTransactionGasProps = {
  txData: string
  txRecipient: string
  txConfirmations?: List<Confirmation>
  txAmount?: string
  operation?: number
  safeTxGas?: string
  manualGasPrice?: string
  manualMaxPrioFee?: string
  manualGasLimit?: string
  isExecution: boolean
  approvalAndExecution: boolean
}

type TransactionGasEstimationResult = {
  txEstimationExecutionStatus: EstimationStatus
  gasCost: string // Cost of gas in raw format (estimatedGas * gasPrice)
  gasCostFormatted: string // Cost of gas in format '< | > 100'
  gasPrice: string // Current price of gas unit
  gasPriceFormatted: string // Current gas price formatted
  gasMaxPrioFee: string // Current max prio gas price
  gasMaxPrioFeeFormatted: string // Current max prio gas formatted
  gasLimit: string // Minimum gas requited to execute the Tx
}

type DefaultGasEstimationParams = {
  txEstimationExecutionStatus: EstimationStatus
  gasPrice: string
  gasPriceFormatted: string
  gasMaxPrioFee: string
  gasMaxPrioFeeFormatted: string
}
export const getDefaultGasEstimation = ({
  txEstimationExecutionStatus,
  gasPrice,
  gasPriceFormatted,
  gasMaxPrioFee,
  gasMaxPrioFeeFormatted,
}: DefaultGasEstimationParams): TransactionGasEstimationResult => {
  return {
    txEstimationExecutionStatus,
    gasCost: '0',
    gasCostFormatted: '< 0.001',
    gasPrice,
    gasPriceFormatted,
    gasMaxPrioFee,
    gasMaxPrioFeeFormatted,
    gasLimit: '0',
  }
}

export const calculateTotalGasCost = (
  gasLimit: string,
  gasPrice: string,
  gasMaxPrioFee: string,
  decimals: number,
): { gasCost: string; gasCostFormatted: string } => {
  const totalPricePerGas = parseInt(gasPrice, 10) + parseInt(gasMaxPrioFee || '0', 10)
  const estimatedGasCosts = parseInt(gasLimit, 10) * totalPricePerGas
  const gasCost = fromTokenUnit(estimatedGasCosts, decimals)
  const gasCostFormatted = formatAmount(gasCost)
  return {
    gasCost,
    gasCostFormatted,
  }
}

export const useEstimateTransactionGas = ({
  txRecipient,
  txData,
  txConfirmations,
  txAmount,
  operation,
  safeTxGas,
  manualGasPrice,
  manualMaxPrioFee,
  manualGasLimit,
  isExecution,
  approvalAndExecution,
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
  const { address: safeAddress, currentVersion: safeVersion } = useSelector(currentSafe) ?? {}
  const { account: from } = useSelector(providerSelector)

  useEffect(() => {
    if (!isExecution || !txData) {
      setGasEstimation((prev) => ({ ...prev, txEstimationExecutionStatus: EstimationStatus.SUCCESS }))
      return
    }

    const estimateGas = async () => {
      const txParameters = {
        safeAddress,
        safeVersion,
        txRecipient,
        txConfirmations,
        txAmount: txAmount || '0',
        txData,
        operation: operation || Operation.CALL,
        from,
        gasPrice: '0',
        gasToken: ZERO_ADDRESS,
        refundReceiver: ZERO_ADDRESS,
        safeTxGas: safeTxGas || '0',
        approvalAndExecution,
      }

      try {
        const gasLimit = manualGasLimit ?? (await estimateGasForTransactionExecution(txParameters)).toString()
        const didTxCallSucceed = await checkTransactionExecution({
          ...txParameters,
          gasLimit,
        })
        const txEstimationExecutionStatus = didTxCallSucceed ? EstimationStatus.SUCCESS : EstimationStatus.FAILURE

        const gasPrice = manualGasPrice ? toWei(manualGasPrice, 'gwei') : await calculateGasPrice()
        const gasPriceFormatted = fromWei(gasPrice, 'gwei')
        const gasMaxPrioFee = isMaxFeeParam()
          ? manualMaxPrioFee
            ? toWei(manualMaxPrioFee, 'gwei')
            : setMaxPrioFeePerGas((await getFeesPerGas()).maxPriorityFeePerGas, parseInt(gasPrice)).toString()
          : '0'
        const gasMaxPrioFeeFormatted = fromWei(gasMaxPrioFee.toString(), 'gwei')
        const { gasCost, gasCostFormatted } = calculateTotalGasCost(
          gasLimit,
          gasPrice,
          gasMaxPrioFee,
          nativeCurrency.decimals,
        )

        setGasEstimation({
          txEstimationExecutionStatus,
          gasCost,
          gasCostFormatted,
          gasPrice,
          gasPriceFormatted,
          gasMaxPrioFee,
          gasMaxPrioFeeFormatted,
          gasLimit,
        })
      } catch (error) {
        console.warn(error.message)
        setGasEstimation(
          getDefaultGasEstimation({
            txEstimationExecutionStatus: EstimationStatus.FAILURE,
            gasPrice: DEFAULT_MAX_GAS_FEE.toString(),
            gasPriceFormatted: fromWei(DEFAULT_MAX_GAS_FEE.toString(), 'gwei'),
            gasMaxPrioFee: DEFAULT_MAX_PRIO_FEE.toString(),
            gasMaxPrioFeeFormatted: fromWei(DEFAULT_MAX_PRIO_FEE.toString(), 'gwei'),
          }),
        )
      }
    }

    estimateGas()
  }, [
    approvalAndExecution,
    isExecution,
    from,
    safeTxGas,
    manualGasLimit,
    manualGasPrice,
    manualMaxPrioFee,
    nativeCurrency.decimals,
    operation,
    safeAddress,
    safeVersion,
    txAmount,
    txConfirmations,
    txData,
    txRecipient,
  ])

  return gasEstimation
}
