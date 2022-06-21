import { useEffect, useState } from 'react'
import { fromWei, toWei } from 'web3-utils'

import { isMaxFeeParam } from 'src/logic/safe/transactions/gas'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import {
  calculateGasPrice,
  setMaxPrioFeePerGas,
  getFeesPerGas,
  DEFAULT_MAX_GAS_FEE,
  DEFAULT_MAX_PRIO_FEE,
} from 'src/logic/wallets/ethTransactions'

export const DEFAULT_GAS = '0'

export enum EstimationStatus {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

type UseEstimateTransactionGasProps = {
  manualGasPrice?: string
  manualMaxPrioFee?: string
  isExecution: boolean
  txData: string
}

type TransactionGasEstimationResult = {
  gasPrice?: string
  gasPriceFormatted?: string
  gasMaxPrioFee?: string
  gasMaxPrioFeeFormatted?: string
}

export const calculateTotalGasCost = (
  gasLimit: string,
  gasPrice: string,
  gasMaxPrioFee: string,
  decimals: number,
): { gasCost: string; gasCostFormatted: string } => {
  const totalPricePerGas = parseInt(gasPrice, 10) + parseInt(gasMaxPrioFee, 10)
  const estimatedGasCosts = parseInt(gasLimit, 10) * totalPricePerGas
  const gasCost = fromTokenUnit(estimatedGasCosts, decimals)
  const gasCostFormatted = formatAmount(gasCost)
  return {
    gasCost,
    gasCostFormatted,
  }
}

export const useEstimateTransactionGas = ({
  manualGasPrice,
  manualMaxPrioFee,
  isExecution,
  txData,
}: UseEstimateTransactionGasProps): TransactionGasEstimationResult => {
  const [gasEstimation, setGasEstimation] = useState<TransactionGasEstimationResult>({
    gasPrice: undefined,
    gasPriceFormatted: undefined,
    gasMaxPrioFee: undefined,
    gasMaxPrioFeeFormatted: undefined,
  })

  useEffect(() => {
    if (!isExecution || !txData) return

    const estimateGas = async () => {
      try {
        const gasPrice = manualGasPrice ? toWei(manualGasPrice, 'gwei') : await calculateGasPrice()
        const gasPriceFormatted = fromWei(gasPrice, 'gwei')
        const gasMaxPrioFee = isMaxFeeParam()
          ? manualMaxPrioFee
            ? toWei(manualMaxPrioFee, 'gwei')
            : setMaxPrioFeePerGas((await getFeesPerGas()).maxPriorityFeePerGas, parseInt(gasPrice)).toString()
          : '0'
        const gasMaxPrioFeeFormatted = fromWei(gasMaxPrioFee.toString(), 'gwei')

        setGasEstimation({
          gasPrice,
          gasPriceFormatted,
          gasMaxPrioFee,
          gasMaxPrioFeeFormatted,
        })
      } catch (error) {
        console.warn(error.message)
        setGasEstimation({
          gasPrice: DEFAULT_MAX_GAS_FEE.toString(),
          gasPriceFormatted: fromWei(DEFAULT_MAX_GAS_FEE.toString(), 'gwei'),
          gasMaxPrioFee: isMaxFeeParam() ? DEFAULT_MAX_PRIO_FEE.toString() : '0',
          gasMaxPrioFeeFormatted: isMaxFeeParam() ? fromWei(DEFAULT_MAX_PRIO_FEE.toString(), 'gwei') : '0',
        })
      }
    }

    estimateGas()
  }, [isExecution, manualGasPrice, manualMaxPrioFee, txData])

  return gasEstimation
}
