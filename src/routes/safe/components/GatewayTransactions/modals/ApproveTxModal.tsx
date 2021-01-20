import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { getConfirmations } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'

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
import { processTransaction } from 'src/logic/safe/store/actions/processGatewayTransaction'

import { safeParamAddressFromStateSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'
import { useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'

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
  canExecute?: boolean
  isCancelTx?: boolean
  isOpen: boolean
  onClose: () => void
  thresholdReached?: boolean
  transaction: TxServiceModel
}

export const ApproveTxModal = ({
  canExecute = false,
  isCancelTx = false,
  isOpen,
  onClose,
  thresholdReached = false,
  transaction,
}: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const userAddress = useSelector(userAccountSelector)
  const classes = useStyles()
  const threshold = useSelector(safeThresholdSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [approveAndExecute, setApproveAndExecute] = useState(canExecute)
  const oneConfirmationLeft = !thresholdReached && transaction.confirmations.length + 1 === threshold
  const isTheTxReadyToBeExecuted = oneConfirmationLeft ? true : thresholdReached
  const { description, title } = getModalTitleAndDescription(thresholdReached, isCancelTx)

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
  } = useEstimateTransactionGas({
    txRecipient: transaction.to,
    txData: transaction.data || EMPTY_DATA,
    txConfirmations: getConfirmations(transaction),
    txAmount: transaction.value,
    preApprovingOwner: approveAndExecute ? userAddress : undefined,
    safeTxGas: transaction.safeTxGas,
    operation: transaction.operation,
  })

  const handleExecuteCheckbox = () => setApproveAndExecute((prevApproveAndExecute) => !prevApproveAndExecute)

  const approveTx = () => {
    dispatch(
      processTransaction({
        safeAddress,
        tx: transaction,
        userAddress,
        notifiedTransaction: TX_NOTIFICATION_TYPES.CONFIRMATION_TX,
        approveAndExecute: canExecute && approveAndExecute && isTheTxReadyToBeExecuted,
        thresholdReached,
      }),
    )
    onClose()
  }

  return (
    <Modal description={description} handleClose={onClose} open={isOpen} title={title}>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight="bolder">
          {title}
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <Row style={{ flexDirection: 'column' }}>
          <Paragraph>{description}</Paragraph>
          <Paragraph color="medium" size="sm">
            Transaction nonce:
            <br />
            <Bold className={classes.nonceNumber}>{transaction.nonce}</Bold>
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
                  control={<Checkbox checked={approveAndExecute} color="primary" onChange={handleExecuteCheckbox} />}
                  label="Execute transaction"
                  data-testid="execute-checkbox"
                />
              )}
            </>
          )}
        </Row>
        <TransactionFees
          gasCostFormatted={gasCostFormatted}
          isExecution={isExecution}
          isCreation={isCreation}
          isOffChainSignature={isOffChainSignature}
          txEstimationExecutionStatus={txEstimationExecutionStatus}
        />
      </Block>
      <Row align="center" className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClose}>
          Exit
        </Button>
        <Button
          color={isCancelTx ? 'secondary' : 'primary'}
          minHeight={42}
          minWidth={214}
          onClick={approveTx}
          testId={isCancelTx ? REJECT_TX_MODAL_SUBMIT_BTN_TEST_ID : APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID}
          type="submit"
          variant="contained"
        >
          {title}
        </Button>
      </Row>
    </Modal>
  )
}
