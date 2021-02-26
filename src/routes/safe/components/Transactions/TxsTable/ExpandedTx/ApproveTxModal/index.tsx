import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { processTransaction } from 'src/logic/safe/store/actions/processTransaction'

import { safeParamAddressFromStateSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'

const useStyles = makeStyles(styles)

export const APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID = 'approve-tx-modal-submit-btn'
export const REJECT_TX_MODAL_SUBMIT_BTN_TEST_ID = 'reject-tx-modal-submit-btn'

const getModalTitleAndDescription = (thresholdReached, isCancelTx) => {
  const modalInfo = {
    title: 'Execute Transaction Rejection',
    description: 'This action will execute this transaction.',
  }

  if (isCancelTx) {
    return modalInfo
  }

  if (thresholdReached) {
    modalInfo.title = 'Execute Transaction'
    modalInfo.description =
      'This action will execute this transaction. A separate Transaction will be performed to submit the execution.'
  } else {
    modalInfo.title = 'Approve Transaction'
    modalInfo.description =
      'This action will approve this transaction. A separate Transaction will be performed to submit the approval.'
  }

  return modalInfo
}

type Props = {
  onClose: () => void
  canExecute: boolean
  isCancelTx?: boolean
  isOpen: boolean
  thresholdReached: boolean
  tx: Transaction
  txParameters: TxParameters
}

export const ApproveTxModal = ({
  onClose,
  canExecute,
  isCancelTx = false,
  isOpen,
  thresholdReached,
  tx,
}: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const userAddress = useSelector(userAccountSelector)
  const classes = useStyles()
  const threshold = useSelector(safeThresholdSelector) || 1
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [approveAndExecute, setApproveAndExecute] = useState(canExecute)
  const { description, title } = getModalTitleAndDescription(thresholdReached, isCancelTx)
  const oneConfirmationLeft = !thresholdReached && tx.confirmations.size + 1 === threshold
  const isTheTxReadyToBeExecuted = oneConfirmationLeft ? true : thresholdReached
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()

  const {
    gasLimit,
    gasPriceFormatted,
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
  } = useEstimateTransactionGas({
    txRecipient: tx.recipient,
    txData: tx.data || '',
    txConfirmations: tx.confirmations,
    txAmount: tx.value,
    preApprovingOwner: approveAndExecute ? userAddress : undefined,
    safeTxGas: tx.safeTxGas,
    operation: tx.operation,
    manualGasPrice,
  })

  const handleExecuteCheckbox = () => setApproveAndExecute((prevApproveAndExecute) => !prevApproveAndExecute)

  const approveTx = (txParameters: TxParameters) => {
    dispatch(
      processTransaction({
        safeAddress,
        tx: tx as any,
        userAddress,
        notifiedTransaction: TX_NOTIFICATION_TYPES.CONFIRMATION_TX,
        approveAndExecute: canExecute && approveAndExecute && isTheTxReadyToBeExecuted,
        ethParameters: txParameters,
        thresholdReached,
      }),
    )
    onClose()
  }

  const getParametersStatus = () => {
    if (canExecute || approveAndExecute) {
      return 'SAFE_DISABLED'
    }

    return 'DISABLED'
  }

  const closeEditModalCallback = (txParameters: TxParameters) => {
    const oldGasPrice = Number(gasPriceFormatted)
    const newGasPrice = Number(txParameters.ethGasPrice)

    if (newGasPrice && oldGasPrice !== newGasPrice) {
      setManualGasPrice(txParameters.ethGasPrice)
    }
  }

  return (
    <Modal description={description} handleClose={onClose} open={isOpen} title={title}>
      <EditableTxParameters
        parametersStatus={getParametersStatus()}
        ethGasLimit={gasLimit}
        ethGasPrice={gasPriceFormatted}
        safeNonce={tx.nonce.toString()}
        safeTxGas={tx.safeTxGas.toString()}
        closeEditModalCallback={closeEditModalCallback}
      >
        {(txParameters, toggleEditMode) => {
          return (
            <>
              {/* Header */}
              <Row align="center" className={classes.heading} grow>
                <Paragraph className={classes.headingText} noMargin weight="bolder">
                  {title}
                </Paragraph>
                <IconButton disableRipple onClick={onClose}>
                  <Close className={classes.closeIcon} />
                </IconButton>
              </Row>

              <Hairline />

              {/* Tx info */}
              <Block className={classes.container}>
                <Row style={{ flexDirection: 'column' }}>
                  <Paragraph>{description}</Paragraph>
                  <Paragraph color="medium" size="sm">
                    Transaction nonce:
                    <br />
                    <Bold className={classes.nonceNumber}>{tx.nonce}</Bold>
                  </Paragraph>

                  {oneConfirmationLeft && canExecute && (
                    <>
                      <Paragraph color="error">
                        Approving this transaction executes it right away.
                        {!isCancelTx &&
                          ' If you want approve but execute the transaction manually later, click on the checkbox below.'}
                      </Paragraph>

                      {!isCancelTx && (
                        <FormControlLabel
                          control={
                            <Checkbox checked={approveAndExecute} color="primary" onChange={handleExecuteCheckbox} />
                          }
                          label="Execute transaction"
                          data-testid="execute-checkbox"
                        />
                      )}
                    </>
                  )}

                  {/* Tx Parameters */}
                  {approveAndExecute && (
                    <TxParametersDetail
                      txParameters={txParameters}
                      onEdit={toggleEditMode}
                      parametersStatus={getParametersStatus()}
                      isTransactionCreation={isCreation}
                      isTransactionExecution={isExecution}
                    />
                  )}
                </Row>
              </Block>
              {txEstimationExecutionStatus === EstimationStatus.LOADING ? null : (
                <Block className={classes.gasCostsContainer}>
                  <TransactionFees
                    gasCostFormatted={gasCostFormatted}
                    isExecution={isExecution}
                    isCreation={isCreation}
                    isOffChainSignature={isOffChainSignature}
                    txEstimationExecutionStatus={txEstimationExecutionStatus}
                  />
                </Block>
              )}
              {/* Footer */}
              <Row align="center" className={classes.buttonRow}>
                <Button minHeight={42} minWidth={140} onClick={onClose}>
                  Exit
                </Button>
                <Button
                  color={isCancelTx ? 'secondary' : 'primary'}
                  minHeight={42}
                  minWidth={214}
                  onClick={() => approveTx(txParameters)}
                  testId={isCancelTx ? REJECT_TX_MODAL_SUBMIT_BTN_TEST_ID : APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID}
                  type="submit"
                  variant="contained"
                  disabled={txEstimationExecutionStatus === EstimationStatus.LOADING}
                >
                  {title}
                </Button>
              </Row>
            </>
          )
        }}
      </EditableTxParameters>
    </Modal>
  )
}
