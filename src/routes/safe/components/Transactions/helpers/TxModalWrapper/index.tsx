import { ReactNode, useState } from 'react'
import styled from 'styled-components'

import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { extractSafeAddress } from 'src/routes/routes'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
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
}

const Container = styled.div`
  padding: 0 ${lg} ${md};
`

/**
 * Determines which fields are displayed in the TxEditableParameters
 */
const getParametersStatus = (isCreation: boolean, doExecute: boolean): ParametersStatus => {
  return isCreation
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
}: Props): React.ReactElement => {
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualMaxPrioFee, setManualMaxPrioFee] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()
  const [manualSafeNonce, setManualSafeNonce] = useState<number | undefined>()
  const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const isOwner = useSelector(grantedSelector)
  const userAddress = useSelector(userAccountSelector)
  const safeAddress = extractSafeAddress()
  const isSpendingLimitTx = isSpendingLimit(txType)
  const preApprovingOwner = isOwner ? userAddress : undefined
  const confirmationsLen = Array.from(txConfirmations || []).length
  const canTxExecute = useCanTxExecute(preApprovingOwner, confirmationsLen, txThreshold)
  const doExecute = executionApproved && canTxExecute

  const {
    gasCostFormatted,
    gasPriceFormatted,
    gasMaxPrioFeeFormatted,
    gasLimit,
    gasEstimation,
    txEstimationExecutionStatus,
    isCreation,
    isOffChainSignature,
  } = useEstimateTransactionGas({
    txData,
    txRecipient: txTo || safeAddress,
    txType,
    txConfirmations,
    txAmount: txValue,
    preApprovingOwner,
    safeTxGas: safeTxGas || manualSafeTxGas,
    manualGasPrice,
    manualMaxPrioFee,
    manualGasLimit,
    manualSafeNonce,
    operation,
  })

  const [submitStatus, setSubmitStatus] = useEstimationStatus(txEstimationExecutionStatus)
  const showCheckbox = !isSpendingLimitTx && canTxExecute && (!txThreshold || txThreshold > confirmationsLen)

  const onEditClose = (txParameters: TxParameters) => {
    const oldGasPrice = gasPriceFormatted
    const newGasPrice = txParameters.ethGasPrice
    const oldGasLimit = gasLimit
    const newGasLimit = txParameters.ethGasLimit
    const oldMaxPrioFee = gasMaxPrioFeeFormatted
    const newMaxPrioFee = txParameters.ethMaxPrioFee
    const oldSafeTxGas = gasEstimation
    const newSafeTxGas = txParameters.safeTxGas
    const newSafeNonce = txParameters.safeNonce

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

    if (newSafeNonce) {
      const newSafeNonceNumber = parseInt(newSafeNonce, 10)
      setManualSafeNonce(newSafeNonceNumber)
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

  const parametersStatus = getParametersStatus(isCreation, doExecute)

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={doExecute}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      ethMaxPrioFee={gasMaxPrioFeeFormatted}
      safeTxGas={gasEstimation}
      safeNonce={txNonce}
      parametersStatus={parametersStatus}
      closeEditModalCallback={onEditClose}
    >
      {(txParameters: TxParameters, toggleEditMode: () => void) => (
        <>
          {children}

          <Container>
            {showCheckbox && <ExecuteCheckbox onChange={setExecutionApproved} />}

            {/* Tx Parameters */}
            {/* FIXME TxParameters should be updated to be used with spending limits */}
            {!isSpendingLimitTx && (
              <TxParametersDetail
                txParameters={txParameters}
                onEdit={toggleEditMode}
                isTransactionCreation={isCreation}
                isTransactionExecution={doExecute}
                isOffChainSignature={isOffChainSignature}
                parametersStatus={parametersStatus}
              />
            )}
          </Container>

          {!isSpendingLimitTx && (
            <ReviewInfoText
              gasCostFormatted={gasCostFormatted}
              isCreation={isCreation}
              isExecution={doExecute}
              safeNonce={txParameters.safeNonce}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          )}

          {/* Footer */}
          <Modal.Footer withoutBorder={!isSpendingLimitTx && submitStatus !== ButtonStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onBack || onClose, text: onBack ? 'Back' : 'Cancel' }}
              confirmButtonProps={{
                onClick: () => onSubmitClick(txParameters),
                status: submitStatus,
                disabled: isSubmitDisabled,
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
