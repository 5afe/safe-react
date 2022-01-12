import { ReactElement, useState } from 'react'
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
import { TxParametersDetail } from '../TxParametersDetail'

type Props = {
  children: ReactElement
  txData: string
  txValue: string
  txType: string
  onSubmit: (txParams: TxParameters, delayExecution: boolean) => void
  onBack: () => void
}

const Container = styled.div`
  padding: 0 ${lg} ${md};
`

export const TxParamsState = ({ children, txData, txValue, txType, onSubmit, onBack }: Props): React.ReactElement => {
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()
  const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const safeAddress = extractSafeAddress()
  const isSpendingLimit = txType === 'spendingLimit'

  const {
    gasCostFormatted,
    gasPriceFormatted,
    gasMaxPrioFeeFormatted,
    gasLimit,
    gasEstimation,
    txEstimationExecutionStatus,
    isExecution,
    isCreation,
    isOffChainSignature,
  } = useEstimateTransactionGas({
    txData,
    txRecipient: safeAddress,
    txType: txType,
    txAmount: txValue,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [submitStatus, setSubmitStatus] = useEstimationStatus(txEstimationExecutionStatus)

  const doExecute = executionApproved && isExecution

  const closeEditModalCallback = (txParameters: TxParameters) => {
    const oldGasPrice = gasPriceFormatted
    const newGasPrice = txParameters.ethGasPrice
    const oldMaxPrioFee = gasMaxPrioFeeFormatted
    const newMaxPrioFee = txParameters.ethMaxPrioFee
    const oldSafeTxGas = gasEstimation
    const newSafeTxGas = txParameters.safeTxGas

    if (newGasPrice && oldGasPrice !== newGasPrice) {
      setManualGasPrice(txParameters.ethGasPrice)
    }

    if (newMaxPrioFee && oldMaxPrioFee !== newMaxPrioFee) {
      setManualGasPrice(txParameters.ethMaxPrioFee)
    }

    if (txParameters.ethGasLimit && gasLimit !== txParameters.ethGasLimit) {
      setManualGasLimit(txParameters.ethGasLimit)
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

    onSubmit(txParameters, !executionApproved)
  }

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={doExecute}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      ethMaxPrioFee={gasMaxPrioFeeFormatted}
      safeTxGas={gasEstimation}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters: TxParameters, toggleEditMode: () => unknown) => (
        <>
          {children}

          <Container>
            {!isSpendingLimit && isExecution && <ExecuteCheckbox onChange={setExecutionApproved} />}

            {/* Tx Parameters */}
            {/* FIXME TxParameters should be updated to be used with spending limits */}
            {!isSpendingLimit && (
              <TxParametersDetail
                txParameters={txParameters}
                onEdit={toggleEditMode}
                isTransactionCreation={isCreation}
                isTransactionExecution={doExecute}
                isOffChainSignature={isOffChainSignature}
              />
            )}
          </Container>

          {!isSpendingLimit && (
            <ReviewInfoText
              gasCostFormatted={gasCostFormatted}
              isCreation={isCreation}
              isExecution={isExecution}
              isOffChainSignature={isOffChainSignature}
              safeNonce={txParameters.safeNonce}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          )}

          {/* Footer */}
          <Modal.Footer withoutBorder={!isSpendingLimit && submitStatus !== ButtonStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onBack, text: 'Back' }}
              confirmButtonProps={{
                onClick: () => onSubmitClick(txParameters),
                status: submitStatus,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : undefined,
                testId: 'submit-tx-btn',
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}
