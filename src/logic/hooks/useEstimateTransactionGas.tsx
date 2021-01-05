import { useEffect, useState } from 'react'
import {
  estimateGasForTransactionApproval,
  estimateGasForTransactionCreation,
  estimateGasForTransactionExecution,
} from 'src/logic/safe/transactions/gas'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { getNetworkInfo } from 'src/config'
import { useSelector } from 'react-redux'
import {
  safeCurrentVersionSelector,
  safeParamAddressFromStateSelector,
  safeThresholdSelector,
} from 'src/logic/safe/store/selectors'
import { CALL, SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES } from '../safe/transactions'
import semverSatisfies from 'semver/functions/satisfies'
import { providerSelector } from '../wallets/store/selectors'

export enum EstimationStatus {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

const checkIfTxIsExecution = (threshold: number, preApprovingOwner?: string, txConfirmations?: number): boolean =>
  txConfirmations === threshold || !!preApprovingOwner || threshold === 1

const checkIfTxIsCreation = (txConfirmations: number): boolean => txConfirmations === 0

const checkIfOffChainSignatureIsPossible = (
  isExecution: boolean,
  isSmartContractWallet: boolean,
  safeVersion?: string,
): boolean =>
  !isExecution &&
  !isSmartContractWallet &&
  !!safeVersion &&
  semverSatisfies(safeVersion, SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES)

type TransactionEstimationProps = {
  txData: string
  safeAddress: string
  txRecipient: string
  isExecution: boolean
  isCreation: boolean
  isOffChainSignature?: boolean
  txAmount?: string
  operation?: number
  from?: string
}

const estimateTransactionGas = async ({
  txAmount,
  txData,
  txRecipient,
  isExecution,
  isCreation,
  isOffChainSignature = false,
  safeAddress,
  operation = CALL,
  from,
}: TransactionEstimationProps): Promise<number> => {
  if (isCreation) {
    return estimateGasForTransactionCreation(safeAddress, txData, txRecipient, txAmount || '0', operation)
  }

  if (!from) {
    throw new Error('No from provided for approving or execute transaction')
  }

  if (isExecution) {
    return estimateGasForTransactionExecution({ safeAddress, txRecipient, txAmount, txData, operation, from })
  }

  return estimateGasForTransactionApproval({
    safeAddress,
    operation,
    txData,
    txAmount,
    txRecipient,
    from,
    isOffChainSignature,
  })
}

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
}: UseEstimateTransactionGasProps): TransactionGasEstimationResult => {
  const [gasEstimation, setGasEstimation] = useState<TransactionGasEstimationResult>({
    txEstimationExecutionStatus: EstimationStatus.LOADING,
    gasEstimation: 0,
    gasCost: '0',
    gasCostFormatted: '< 0.001',
    gasPrice: '0',
    isExecution: false,
    isCreation: false,
    isOffChainSignature: false,
  })
  const { nativeCoin } = getNetworkInfo()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const threshold = useSelector(safeThresholdSelector)
  const safeVersion = useSelector(safeCurrentVersionSelector)
  const { account: from, smartContractWallet } = useSelector(providerSelector)

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      if (!txData.length) {
        return
      }

      const isExecution = checkIfTxIsExecution(Number(threshold), preApprovingOwner, txConfirmations)
      const isCreation = checkIfTxIsCreation(txConfirmations || 0)

      try {
        const isOffChainSignature = checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)

        const gasEstimation = await estimateTransactionGas({
          safeAddress,
          txRecipient,
          txData,
          txAmount,
          isExecution,
          isCreation,
          isOffChainSignature,
          operation,
          from,
        })
        const gasPrice = await calculateGasPrice()
        const estimatedGasCosts = gasEstimation * parseInt(gasPrice, 10)
        const gasCost = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
        const gasCostFormatted = formatAmount(gasCost)

        if (isCurrent) {
          let txEstimationExecutionStatus = EstimationStatus.SUCCESS

          if (gasEstimation <= 0) {
            txEstimationExecutionStatus = isOffChainSignature ? EstimationStatus.SUCCESS : EstimationStatus.FAILURE
          }

          setGasEstimation({
            txEstimationExecutionStatus,
            gasEstimation,
            gasCost,
            gasCostFormatted,
            gasPrice,
            isExecution,
            isCreation,
            isOffChainSignature,
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
          isExecution,
          isCreation,
          isOffChainSignature: false,
        })
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
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
  ])

  return gasEstimation
}
