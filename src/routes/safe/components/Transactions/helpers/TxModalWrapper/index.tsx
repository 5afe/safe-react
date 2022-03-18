import { ReactNode, useState } from 'react'
import styled from 'styled-components'

import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { extractSafeAddress } from 'src/routes/routes'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
import { TxEstimatedFeesDetail } from 'src/routes/safe/components/Transactions/helpers/TxEstimatedFeesDetail'
import ExecuteCheckbox from 'src/components/ExecuteCheckbox'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { lg, md } from 'src/theme/variables'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { isSpendingLimit, ParametersStatus } from 'src/routes/safe/components/Transactions/helpers/utils'
import useCanTxExecute from 'src/logic/hooks/useCanTxExecute'
import { useSelector } from 'react-redux'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { List } from 'immutable'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { getNativeCurrency } from 'src/config'
import { useEstimateSafeTxGas } from 'src/logic/hooks/useEstimateSafeTxGas'
import { checkIfOffChainSignatureIsPossible } from 'src/logic/safe/safeTxSigner'
import { currentSafe } from 'src/logic/safe/store/selectors'
import useIsSmartContractWallet from 'src/logic/hooks/useIsSmartContractWallet'

type Props = {
  children: ReactNode
  operation?: Operation
  txNonce?: string
  txData: string
  txValue?: string
  txTo?: string
  txType?: string
  txConfirmations?: List<Confirmation>
  txThreshold?: number
  safeTxGas?: string
  onSubmit: (txParams: TxParameters, delayExecution?: boolean) => void
  onClose?: () => void
  onBack?: (...rest: any) => void
  submitText?: string
  isSubmitDisabled?: boolean
  isRejectTx?: boolean
}

const Container = styled.div`
  padding: 0 ${lg} ${md};
`
export const isApproveAndExecute = (
  threshold: number,
  txConfirmations: number,
  txType?: string,
  preApprovingOwner?: string,
): boolean => {
  if (txConfirmations === threshold) return false
  if (!preApprovingOwner) return false
  return txConfirmations + 1 === threshold || isSpendingLimit(txType)
}

export const isMultisigCreation = (txConfirmations: number, txType?: string): boolean =>
  txConfirmations === 0 && !isSpendingLimit(txType)

/**
 * Determines which fields are displayed in the TxEditableParameters
 */
const getParametersStatus = (isCreation: boolean, doExecute: boolean, isRejectTx = false): ParametersStatus => {
  return isCreation && !isRejectTx
    ? doExecute
      ? 'ENABLED'
      : 'ETH_HIDDEN' // allow editing nonce when creating
    : doExecute
    ? 'SAFE_DISABLED'
    : 'DISABLED' // when not creating, nonce cannot be edited
}

export const TxModalWrapper = ({
  children,
  operation,
  txNonce,
  txData,
  txValue = '0',
  txTo,
  txType,
  txConfirmations,
  txThreshold,
  safeTxGas,
  onSubmit,
  onBack,
  onClose,
  submitText,
  isSubmitDisabled,
  isRejectTx = false,
}: Props): React.ReactElement => {
  const [manualSafeTxGas, setManualSafeTxGas] = useState<string>('0')
  const [manualGasPrice, setManualGasPrice] = useState<string>()
  const [manualMaxPrioFee, setManualMaxPrioFee] = useState<string>()
  const [manualGasLimit, setManualGasLimit] = useState<string>()
  const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const isOwner = useSelector(grantedSelector)
  const userAddress = useSelector(userAccountSelector)
  const safeAddress = extractSafeAddress()
  const isSpendingLimitTx = isSpendingLimit(txType)
  const preApprovingOwner = isOwner ? userAddress : undefined
  const confirmationsLen = Array.from(txConfirmations || []).length
  const canTxExecute = useCanTxExecute(preApprovingOwner, confirmationsLen, txThreshold, txNonce)
  const doExecute = executionApproved && canTxExecute
  const showCheckbox = !isSpendingLimitTx && canTxExecute && (!txThreshold || txThreshold > confirmationsLen)
  const nativeCurrency = getNativeCurrency()
  const { currentVersion: safeVersion, threshold } = useSelector(currentSafe) ?? {}
  const isCreation = isMultisigCreation(confirmationsLen, txType)
  const isSmartContract = useIsSmartContractWallet(userAddress)

  const isOffChainSignature = checkIfOffChainSignatureIsPossible(doExecute, isSmartContract, safeVersion)

  const approvalAndExecution = isApproveAndExecute(Number(threshold), confirmationsLen, txType, preApprovingOwner)

  const safeTxGasEstimation = useEstimateSafeTxGas({
    isCreation,
    isRejectTx,
    txData,
    txRecipient: txTo || safeAddress,
    txAmount: txValue,
    operation,
  })

  const { gasCostFormatted, gasPriceFormatted, gasMaxPrioFeeFormatted, gasLimit, txEstimationExecutionStatus } =
    useEstimateTransactionGas({
      txData,
      txRecipient: txTo || safeAddress,
      txConfirmations,
      txAmount: txValue,
      safeTxGas: safeTxGas || manualSafeTxGas,
      manualGasPrice,
      manualMaxPrioFee,
      manualGasLimit,
      operation,
      isExecution: doExecute,
      approvalAndExecution,
    })

  const [submitStatus, setSubmitStatus] = useEstimationStatus(txEstimationExecutionStatus)

  const onEditClose = (txParameters: TxParameters) => {
    const oldGasPrice = gasPriceFormatted
    const newGasPrice = txParameters.ethGasPrice
    const oldGasLimit = gasLimit
    const newGasLimit = txParameters.ethGasLimit
    const oldMaxPrioFee = gasMaxPrioFeeFormatted
    const newMaxPrioFee = txParameters.ethMaxPrioFee
    const oldSafeTxGas = safeTxGasEstimation
    const newSafeTxGas = txParameters.safeTxGas

    if (oldGasPrice !== newGasPrice) {
      setManualGasPrice(newGasPrice)
    }

    if (oldMaxPrioFee !== newMaxPrioFee) {
      setManualMaxPrioFee(newMaxPrioFee)
    }

    if (oldGasLimit !== newGasLimit) {
      setManualGasLimit(newGasLimit)
    }

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  const onSubmitClick = (txParameters: TxParameters) => {
    setSubmitStatus(ButtonStatus.LOADING)

    if (!safeAddress) {
      setSubmitStatus(ButtonStatus.READY)
      logError(Errors._802)
      return
    }

    onSubmit(txParameters, !doExecute)
  }

  const parametersStatus = getParametersStatus(isCreation, doExecute, isRejectTx)

  const gasCost = `${gasCostFormatted} ${nativeCurrency.symbol}`

  return (
    <EditableTxParameters
      isExecution={doExecute}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      ethMaxPrioFee={gasMaxPrioFeeFormatted}
      safeTxGas={safeTxGasEstimation}
      safeNonce={txNonce}
      parametersStatus={parametersStatus}
      closeEditModalCallback={onEditClose}
    >
      {(txParameters: TxParameters, toggleEditMode: () => void) => (
        <>
          {children}

          <Container>
            {showCheckbox && <ExecuteCheckbox checked={executionApproved} onChange={setExecutionApproved} />}

            {!isSpendingLimitTx && doExecute && (
              <TxEstimatedFeesDetail
                txParameters={txParameters}
                gasCost={canTxExecute ? gasCost : ''}
                onEdit={toggleEditMode}
                isTransactionCreation={isCreation}
                isTransactionExecution={doExecute}
                isOffChainSignature={isOffChainSignature}
              />
            )}

            {/* Tx Parameters */}
            {/* FIXME TxParameters should be updated to be used with spending limits */}
            {!isSpendingLimitTx && (
              <TxParametersDetail
                onEdit={toggleEditMode}
                txParameters={txParameters}
                isTransactionCreation={isCreation}
                isOffChainSignature={isOffChainSignature}
                parametersStatus={parametersStatus}
              />
            )}
          </Container>

          {!isSpendingLimitTx && (
            <ReviewInfoText
              isCreation={isCreation}
              isExecution={doExecute}
              isRejection={isRejectTx}
              safeNonce={txParameters.safeNonce}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          )}

          {/* Footer */}
          <Modal.Footer withoutBorder>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onBack || onClose, text: onBack ? 'Back' : 'Cancel' }}
              confirmButtonProps={{
                onClick: () => onSubmitClick(txParameters),
                status: submitStatus,
                disabled: isSubmitDisabled,
                color: isRejectTx ? 'error' : undefined,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : submitText,
                testId: 'submit-tx-btn',
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}
