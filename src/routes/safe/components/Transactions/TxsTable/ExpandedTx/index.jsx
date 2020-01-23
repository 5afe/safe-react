// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import cn from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Span from '~/components/layout/Span'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import EtherScanLink from '~/components/EtherscanLink'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import TxDescription from './TxDescription'
import OwnersColumn from './OwnersColumn'
import CancelTxModal from './CancelTxModal'
import ApproveTxModal from './ApproveTxModal'
import { styles } from './style'
import { formatDate } from '../columns'
import IncomingTxDescription from '~/routes/safe/components/Transactions/TxsTable/ExpandedTx/IncomingTxDescription'
import { INCOMING_TX_TYPE } from '~/routes/safe/store/models/incomingTransaction'

type Props = {
  tx: Transaction,
  cancelTx: Transaction,
  threshold: number,
  owners: List<Owner>,
  granted: boolean,
  userAddress: string,
  safeAddress: string,
  createTransaction: Function,
  processTransaction: Function,
  nonce: number
}

type OpenModal = "cancelTx" | "approveTx" | "approveCancelTx" | null

const txStatusToLabel = {
  success: 'Success',
  awaiting_your_confirmation: 'Awaiting your confirmation',
  awaiting_confirmations: 'Awaiting confirmations',
  cancelled: 'Cancelled',
  awaiting_execution: 'Awaiting execution',
  pending: 'Pending',
}

const useStyles = makeStyles(styles)

const ExpandedTx = ({
  tx,
  cancelTx,
  threshold,
  owners,
  granted,
  userAddress,
  safeAddress,
  createTransaction,
  processTransaction,
  nonce,
}: Props) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  const openApproveModal = () => setOpenModal('approveTx')
  const openApproveCancelModal = () => setOpenModal('approveCancelTx')
  const openCancelModal = () => setOpenModal('cancelTx')
  const closeModal = () => setOpenModal(null)
  const thresholdReached = tx.type !== INCOMING_TX_TYPE && threshold <= tx.confirmations.size
  const canExecute = tx.type !== INCOMING_TX_TYPE && nonce === tx.nonce
  const cancelThresholdReached = !!cancelTx && threshold <= cancelTx.confirmations.size
  const canExecuteCancel = !!cancelTx && nonce === cancelTx.nonce

  return (
    <>
      <Block className={classes.expandedTxBlock}>
        <Row>
          <Col xs={6} layout="column">
            <Block
              className={cn(
                classes.txDataContainer,
                tx.type === INCOMING_TX_TYPE && classes.incomingTxBlock,
              )}
            >
              <Block align="left" className={classes.txData}>
                <Bold className={classes.txHash}>TX hash:</Bold>
                {tx.executionTxHash ? (
                  <EtherScanLink type="tx" value={tx.executionTxHash} cut={8} />
                ) : (
                  'n/a'
                )}
              </Block>
              <Paragraph noMargin>
                <Bold>TX status: </Bold>
                <Span>{txStatusToLabel[tx.status]}</Span>
              </Paragraph>
              {tx.type === INCOMING_TX_TYPE ? (
                <>
                  <Paragraph noMargin>
                    <Bold>TX fee: </Bold>
                    {tx.fee}
                  </Paragraph>
                  <Paragraph noMargin>
                    <Bold>TX created: </Bold>
                    {formatDate(tx.executionDate)}
                  </Paragraph>
                </>
              ) : (
                <>
                  <Paragraph noMargin>
                    <Bold>TX created: </Bold>
                    {formatDate(tx.submissionDate)}
                  </Paragraph>
                  {tx.executionDate && (
                    <Paragraph noMargin>
                      <Bold>TX executed: </Bold>
                      {formatDate(tx.executionDate)}
                    </Paragraph>
                  )}
                  {tx.refundParams && (
                    <Paragraph noMargin>
                      <Bold>TX refund: </Bold>
                      max.
                      {' '}
                      {tx.refundParams.fee}
                      {' '}
                      {tx.refundParams.symbol}
                    </Paragraph>
                  )}
                  {tx.operation === 1 && (
                    <Paragraph noMargin>
                      <Bold>Delegate Call</Bold>
                    </Paragraph>
                  )}
                  {tx.operation === 2 && (
                    <Paragraph noMargin>
                      <Bold>Contract Creation</Bold>
                    </Paragraph>
                  )}
                </>
              )}
            </Block>
            <Hairline />
            {tx.type === INCOMING_TX_TYPE ? (
              <IncomingTxDescription tx={tx} />
            ) : (
              <TxDescription tx={tx} />
            )}
          </Col>
          {tx.type !== INCOMING_TX_TYPE && (
            <OwnersColumn
              tx={tx}
              cancelTx={cancelTx}
              owners={owners}
              granted={granted}
              canExecute={canExecute}
              canExecuteCancel={canExecuteCancel}
              threshold={threshold}
              userAddress={userAddress}
              thresholdReached={thresholdReached}
              cancelThresholdReached={cancelThresholdReached}
              safeAddress={safeAddress}
              onTxConfirm={openApproveModal}
              onCancelTxConfirm={openApproveCancelModal}
              onTxCancel={openCancelModal}
              onTxExecute={openApproveModal}
              onCancelTxExecute={openApproveCancelModal}
            />
          )}
        </Row>
      </Block>
      {openModal === 'cancelTx' && (
        <CancelTxModal
          isOpen
          createTransaction={createTransaction}
          onClose={closeModal}
          tx={tx}
          safeAddress={safeAddress}
        />
      )}
      {openModal === 'approveTx' && (
        <ApproveTxModal
          isOpen
          processTransaction={processTransaction}
          onClose={closeModal}
          canExecute={canExecute}
          tx={tx}
          userAddress={userAddress}
          safeAddress={safeAddress}
          threshold={threshold}
          thresholdReached={thresholdReached}
        />
      )}
      {openModal === 'approveCancelTx' && (
        <ApproveTxModal
          isOpen
          processTransaction={processTransaction}
          onClose={closeModal}
          canExecute={canExecuteCancel}
          tx={cancelTx}
          userAddress={userAddress}
          safeAddress={safeAddress}
          threshold={threshold}
          thresholdReached={cancelThresholdReached}
        />
      )}
    </>
  )
}

export default ExpandedTx
