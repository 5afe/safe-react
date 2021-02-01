import { List } from 'immutable'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal from 'src/components/Modal'
import { TransactionFees } from 'src/components/TransactionsFees'
import { useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { processTransaction } from 'src/logic/safe/store/actions/processGatewayTransaction'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'
import {
  ExpandedTxDetails,
  isMultiSigExecutionDetails,
  Operation,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { isThresholdReached } from 'src/routes/safe/components/GatewayTransactions/hooks/useTransactionActions'
import { Overwrite } from 'src/types/helpers'

import { styles } from './style'

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
  gwTransaction: Overwrite<Transaction, { txDetails: ExpandedTxDetails }>
}

export const ApproveTxModal = ({
  canExecute = false,
  isCancelTx = false,
  isOpen,
  onClose,
  gwTransaction,
}: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const userAddress = useSelector(userAccountSelector)
  const classes = useStyles()
  const transaction = useRef(gwTransaction)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [approveAndExecute, setApproveAndExecute] = useState(canExecute)
  const thresholdReached = !!(
    transaction.current.executionInfo && isThresholdReached(transaction.current.executionInfo)
  )
  const _threshold = transaction.current.executionInfo?.confirmationsRequired ?? 0
  const _countingCurrentConfirmation = (transaction.current.executionInfo?.confirmationsSubmitted ?? 0) + 1
  const oneConfirmationLeft = !thresholdReached && _countingCurrentConfirmation === _threshold
  const isTheTxReadyToBeExecuted = oneConfirmationLeft ? true : thresholdReached
  const { description, title } = getModalTitleAndDescription(thresholdReached, isCancelTx)

  const confirmations = useMemo(
    () =>
      transaction.current.txDetails.detailedExecutionInfo &&
      isMultiSigExecutionDetails(transaction.current.txDetails.detailedExecutionInfo)
        ? List(
            transaction.current.txDetails.detailedExecutionInfo.confirmations.map(({ signer, signature }) =>
              makeConfirmation({ owner: signer, signature }),
            ),
          )
        : List([]),
    [],
  )

  const data = useMemo(() => transaction.current.txDetails.txData?.hexData ?? EMPTY_DATA, [])

  const baseGas = useMemo(
    () =>
      isMultiSigExecutionDetails(transaction.current.txDetails.detailedExecutionInfo)
        ? transaction.current.txDetails.detailedExecutionInfo.baseGas
        : 0,
    [],
  )

  const gasPrice = useMemo(
    () =>
      isMultiSigExecutionDetails(transaction.current.txDetails.detailedExecutionInfo)
        ? transaction.current.txDetails.detailedExecutionInfo.gasPrice
        : '0',
    [],
  )

  const safeTxGas = useMemo(
    () =>
      isMultiSigExecutionDetails(transaction.current.txDetails.detailedExecutionInfo)
        ? transaction.current.txDetails.detailedExecutionInfo.safeTxGas
        : 0,
    [],
  )

  const gasToken = useMemo(
    () =>
      isMultiSigExecutionDetails(transaction.current.txDetails.detailedExecutionInfo)
        ? transaction.current.txDetails.detailedExecutionInfo.gasToken
        : ZERO_ADDRESS,
    [],
  )

  const nonce = useMemo(() => transaction.current.executionInfo?.nonce ?? 0, [])

  const refundReceiver = useMemo(
    () =>
      isMultiSigExecutionDetails(transaction.current.txDetails.detailedExecutionInfo)
        ? transaction.current.txDetails.detailedExecutionInfo.refundReceiver
        : ZERO_ADDRESS,
    [],
  )

  const safeTxHash = useMemo(
    () =>
      isMultiSigExecutionDetails(transaction.current.txDetails.detailedExecutionInfo)
        ? transaction.current.txDetails.detailedExecutionInfo.safeTxHash
        : EMPTY_DATA,
    [],
  )

  const value = useMemo(
    () =>
      transaction.current.txInfo.type === 'Transfer'
        ? transaction.current.txInfo.transferInfo.value
        : transaction.current.txInfo.type === 'Custom'
        ? transaction.current.txInfo.value
        : '0',
    [],
  )

  const to = useMemo(
    () =>
      transaction.current.txInfo.type === 'Transfer'
        ? transaction.current.txInfo.recipient
        : transaction.current.txInfo.type === 'Custom'
        ? transaction.current.txInfo.to
        : safeAddress,
    [safeAddress],
  )

  const operation = useMemo(() => transaction.current.txDetails.txData?.operation ?? Operation.CALL, [])

  const origin = useMemo(
    () =>
      transaction.current.safeAppInfo
        ? JSON.stringify({ name: transaction.current.safeAppInfo.name, url: transaction.current.safeAppInfo.url })
        : '',
    [],
  )

  const id = useMemo(() => transaction.current.id, [])

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
  } = useEstimateTransactionGas({
    txRecipient: to,
    txData: data,
    txConfirmations: confirmations,
    txAmount: value,
    preApprovingOwner: approveAndExecute ? userAddress : undefined,
    safeTxGas,
    operation,
  })

  const handleExecuteCheckbox = () => setApproveAndExecute((prevApproveAndExecute) => !prevApproveAndExecute)

  const approveTx = () => {
    dispatch(
      processTransaction({
        safeAddress,
        tx: {
          id,
          baseGas,
          confirmations,
          data,
          gasPrice,
          gasToken,
          nonce,
          operation,
          origin,
          refundReceiver,
          safeTxGas,
          safeTxHash,
          to,
          value,
        },
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
            <Bold className={classes.nonceNumber}>{nonce}</Bold>
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
