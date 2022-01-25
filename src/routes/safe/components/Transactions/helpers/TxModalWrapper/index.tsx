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
import { isSpendingLimit } from 'src/routes/safe/components/Transactions/helpers/utils'
import useCanTxExecute from 'src/logic/hooks/useCanTxExecute'
import { getNativeCurrency } from 'src/config'

type Props = {
  children: ReactNode
  operation?: number
  txData: string
  txValue?: string
  txTo?: string
  txType?: string
  onSubmit: (txParams: TxParameters, delayExecution?: boolean) => void
  onBack?: (...rest: any) => void
  submitText?: string
  isConfirmDisabled?: boolean
}

const Container = styled.div`
  padding: 0 ${lg} ${md};
`

export const TxModalWrapper = ({
  children,
  operation,
  txData,
  txValue = '0',
  txTo,
  txType,
  onSubmit,
  onBack,
  submitText,
  isConfirmDisabled,
}: Props): React.ReactElement => {
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualMaxPrioFee, setManualMaxPrioFee] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()
  const [manualSafeNonce, setManualSafeNonce] = useState<number | undefined>()
  const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const safeAddress = extractSafeAddress()
  const isSpendingLimitTx = isSpendingLimit(txType)
  const nativeCurrency = getNativeCurrency()

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
    txAmount: txValue,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualMaxPrioFee,
    manualGasLimit,
    manualSafeNonce,
    operation,
  })

  const [submitStatus, setSubmitStatus] = useEstimationStatus(txEstimationExecutionStatus)

  const canTxExecute = useCanTxExecute(undefined, manualSafeNonce)
  const doExecute = executionApproved && canTxExecute

  const onClose = (txParameters: TxParameters) => {
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

  const gasCost = `${gasCostFormatted} ${nativeCurrency.symbol}`

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={doExecute}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      ethMaxPrioFee={gasMaxPrioFeeFormatted}
      safeTxGas={gasEstimation}
      closeEditModalCallback={onClose}
    >
      {(txParameters: TxParameters, toggleEditMode: () => unknown) => (
        <>
          {children}

          <Container>
            {!isSpendingLimitTx && (
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
                isTransactionExecution={doExecute}
                isOffChainSignature={isOffChainSignature}
              />
            )}

            {!isSpendingLimitTx && canTxExecute && <ExecuteCheckbox onChange={setExecutionApproved} />}
          </Container>

          {!isSpendingLimitTx && (
            <ReviewInfoText
              isCreation={isCreation}
              isExecution={doExecute}
              safeNonce={txParameters.safeNonce}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          )}

          {/* Footer */}
          <Modal.Footer withoutBorder={!isSpendingLimitTx && submitStatus !== ButtonStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onBack || onClose, text: 'Back' }}
              confirmButtonProps={{
                onClick: () => onSubmitClick(txParameters),
                status: submitStatus,
                disabled: isConfirmDisabled,
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
