import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useStyles } from './style'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { processTransaction } from 'src/logic/safe/store/actions/processTransaction'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { isThresholdReached } from 'src/routes/safe/components/Transactions/TxList/hooks/useTransactionActions'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { Overwrite } from 'src/types/helpers'
import { NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { ExpandedTxDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { extractSafeAddress } from 'src/routes/routes'
import ExecuteCheckbox from 'src/components/ExecuteCheckbox'
import { useTxInfo } from 'src/routes/safe/components/Transactions/TxList/hooks/useTxInfo'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'

export const APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID = 'approve-tx-modal-submit-btn'
export const REJECT_TX_MODAL_SUBMIT_BTN_TEST_ID = 'reject-tx-modal-submit-btn'

const getModalTitleAndDescription = (
  thresholdReached: boolean,
  isCancelTx: boolean,
): { title: string; description: string } => {
  const modalInfo = {
    title: 'Execute transaction rejection',
    description: 'This action will execute this transaction.',
  }

  if (isCancelTx) {
    return modalInfo
  }

  if (thresholdReached) {
    modalInfo.title = 'Execute transaction'
    modalInfo.description = 'This action will execute this transaction.'
  } else {
    modalInfo.title = 'Approve Transaction'
    modalInfo.description =
      'This action will approve this transaction. A separate Transaction will be performed to submit the approval.'
  }

  return modalInfo
}

type Props = {
  onClose: () => void
  isExecution?: boolean
  isCancelTx?: boolean
  isOpen: boolean
  transaction: Overwrite<Transaction, { txDetails: ExpandedTxDetails }>
  txParameters: TxParameters
}

export const ApproveTxModal = ({
  onClose,
  isExecution = false,
  isCancelTx = false,
  isOpen,
  transaction,
}: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const userAddress = useSelector(userAccountSelector)
  const classes = useStyles()
  const safeAddress = extractSafeAddress()
  const [shouldExecute, setShouldExecute] = useState(isExecution)
  const executionInfo = transaction.executionInfo as MultisigExecutionInfo
  const thresholdReached = !!(transaction.executionInfo && isThresholdReached(executionInfo))
  const _threshold = executionInfo?.confirmationsRequired ?? 0
  const _countingCurrentConfirmation = (executionInfo?.confirmationsSubmitted ?? 0) + 1
  const { description, title } = getModalTitleAndDescription(thresholdReached, isCancelTx)
  const oneConfirmationLeft = !thresholdReached && _countingCurrentConfirmation === _threshold
  const isTheTxReadyToBeExecuted = oneConfirmationLeft ? true : thresholdReached
  const {
    confirmations,
    data,
    baseGas,
    gasPrice,
    safeTxGas,
    gasToken,
    nonce,
    refundReceiver,
    safeTxHash,
    value,
    to,
    operation,
    origin,
    id,
  } = useTxInfo(transaction)

  const approveTx = (txParameters: TxParameters) => {
    if (thresholdReached && confirmations.size < _threshold) {
      dispatch(enqueueSnackbar(NOTIFICATIONS.TX_FETCH_SIGNATURES_ERROR_MSG))
    } else {
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
          approveAndExecute: isExecution && shouldExecute && isTheTxReadyToBeExecuted,
          ethParameters: txParameters,
          thresholdReached,
        }),
      )
    }
    onClose()
  }

  const getParametersStatus = () => {
    if (isExecution || shouldExecute) {
      return 'SAFE_DISABLED'
    }

    return 'DISABLED'
  }

  return (
    <Modal description={description} handleClose={onClose} open={isOpen} title={title}>
      <TxModalWrapper
        txData={data}
        txTo={to}
        txConfirmations={confirmations}
        txPreApprovingOwner={shouldExecute ? userAddress : undefined}
        onSubmit={approveTx}
        onBack={onClose}
        isExecution
        parametersStatus={getParametersStatus()}
      >
        <ModalHeader onClose={onClose} title={title} />

        <Hairline />

        {/* Tx info */}
        <Block className={classes.container}>
          <Row style={{ flexDirection: 'column' }}>
            <Paragraph>{description}</Paragraph>
            <Paragraph color="medium" size="sm">
              Transaction nonce:
              <br />
              <Bold className={classes.nonceNumber}>{nonce}</Bold>
            </Paragraph>

            {oneConfirmationLeft && isExecution && !isCancelTx && <ExecuteCheckbox onChange={setShouldExecute} />}
          </Row>
        </Block>
      </TxModalWrapper>
    </Modal>
  )
}
