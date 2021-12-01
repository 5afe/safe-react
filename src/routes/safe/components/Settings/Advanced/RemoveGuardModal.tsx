import { ReactElement, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal, { ButtonStatus, Modal as GenericModal } from 'src/components/Modal'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
import { getExplorerInfo } from 'src/config'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'

import { currentSafe } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

import { useStyles } from './style'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { getRemoveGuardTxData } from 'src/logic/safe/utils/guardManager'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { ModalHeader } from '../../Balances/SendModal/screens/ModalHeader'

interface RemoveGuardModalProps {
  onClose: () => void
  guardAddress: string
}

export const RemoveGuardModal = ({ onClose, guardAddress }: RemoveGuardModalProps): ReactElement => {
  const classes = useStyles()

  const { address: safeAddress, currentVersion: safeVersion } = useSelector(currentSafe)
  const dispatch = useDispatch()
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const txData = useMemo(() => getRemoveGuardTxData(safeAddress, safeVersion), [safeAddress, safeVersion])

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
    gasLimit,
    gasEstimation,
    gasPriceFormatted,
  } = useEstimateTransactionGas({
    txData,
    txRecipient: safeAddress,
    txAmount: '0',
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  const removeTransactionGuard = async (txParameters: TxParameters): Promise<void> => {
    try {
      dispatch(
        createTransaction({
          safeAddress,
          to: safeAddress,
          valueInWei: '0',
          txData,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
        }),
      )
    } catch (e) {
      logError(Errors._807, `${guardAddress} – ${e.message}`)
    }
  }

  const closeEditModalCallback = (txParameters: TxParameters) => {
    const oldGasPrice = gasPriceFormatted
    const newGasPrice = txParameters.ethGasPrice
    const oldSafeTxGas = gasEstimation
    const newSafeTxGas = txParameters.safeTxGas

    if (newGasPrice && oldGasPrice !== newGasPrice) {
      setManualGasPrice(txParameters.ethGasPrice)
    }

    if (txParameters.ethGasLimit && gasLimit !== txParameters.ethGasLimit) {
      setManualGasLimit(txParameters.ethGasLimit)
    }

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  let confirmButtonText = 'Remove'
  if (ButtonStatus.LOADING === buttonStatus) {
    confirmButtonText = txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : 'Removing'
  }

  return (
    <Modal
      description="Remove the selected Transaction Guard"
      handleClose={onClose}
      paperClassName="modal"
      title="Remove Transaction Guard"
      open
    >
      <EditableTxParameters
        isOffChainSignature={isOffChainSignature}
        isExecution={isExecution}
        ethGasLimit={gasLimit}
        ethGasPrice={gasPriceFormatted}
        safeTxGas={gasEstimation}
        closeEditModalCallback={closeEditModalCallback}
      >
        {(txParameters, toggleEditMode) => {
          return (
            <>
              <ModalHeader onClose={onClose} title="Remove Guard" />
              <Hairline />
              <Block>
                <Row className={classes.modalOwner}>
                  <Col align="center" xs={1}>
                    <PrefixedEthHashInfo
                      hash={guardAddress}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(guardAddress)}
                    />
                  </Col>
                </Row>
                <Row className={classes.modalDescription}>
                  <Paragraph noMargin size="lg">
                    Once the transaction guard has been removed, checks by the transaction guard will not be conducted
                    before or after any subsequent transactions.
                  </Paragraph>
                </Row>
              </Block>
              <Block className={classes.accordionContainer}>
                {/* Tx Parameters */}
                <TxParametersDetail
                  txParameters={txParameters}
                  onEdit={toggleEditMode}
                  isTransactionCreation={isCreation}
                  isTransactionExecution={isExecution}
                  isOffChainSignature={isOffChainSignature}
                />
              </Block>
              <Row className={classes.modalDescription}>
                <ReviewInfoText
                  gasCostFormatted={gasCostFormatted}
                  isCreation={isCreation}
                  isExecution={isExecution}
                  isOffChainSignature={isOffChainSignature}
                  safeNonce={txParameters.safeNonce}
                  txEstimationExecutionStatus={txEstimationExecutionStatus}
                />
              </Row>
              <GenericModal.Footer withoutBorder={buttonStatus !== ButtonStatus.LOADING}>
                <GenericModal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{
                    color: 'error',
                    onClick: () => removeTransactionGuard(txParameters),
                    status: buttonStatus,
                    text: confirmButtonText,
                  }}
                />
              </GenericModal.Footer>
            </>
          )
        }}
      </EditableTxParameters>
    </Modal>
  )
}
