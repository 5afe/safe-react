// @flow
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { List } from 'immutable'
import React, { useState } from 'react'

import { formatDate } from '../columns'

import ApproveTxModal from './ApproveTxModal'
import OwnersColumn from './OwnersColumn'
import RejectTxModal from './RejectTxModal'
import TxDescription from './TxDescription'
import { styles } from './style'

import EtherScanLink from '~/components/EtherscanLink'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Span from '~/components/layout/Span'
import IncomingTxDescription from '~/routes/safe/components/Transactions/TxsTable/ExpandedTx/IncomingTxDescription'
import { INCOMING_TX_TYPE } from '~/routes/safe/store/models/incomingTransaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import { type Transaction } from '~/routes/safe/store/models/transaction'

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
  nonce: number,
}

type OpenModal = 'rejectTx' | 'approveTx' | 'executeRejectTx' | null

const useStyles = makeStyles(styles)

const ExpandedTx = ({
  cancelTx,
  createTransaction,
  granted,
  nonce,
  owners,
  processTransaction,
  safeAddress,
  threshold,
  tx,
  userAddress,
}: Props) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  const openApproveModal = () => setOpenModal('approveTx')
  const closeModal = () => setOpenModal(null)
  const thresholdReached = tx.type !== INCOMING_TX_TYPE && threshold <= tx.confirmations.size
  const canExecute = tx.type !== INCOMING_TX_TYPE && nonce === tx.nonce
  const cancelThresholdReached = !!cancelTx && threshold <= cancelTx.confirmations.size
  const canExecuteCancel = nonce === tx.nonce

  const openRejectModal = () => {
    if (!!cancelTx && nonce === cancelTx.nonce) {
      setOpenModal('executeRejectTx')
    } else {
      setOpenModal('rejectTx')
    }
  }

  return (
    <>
      <Block className={classes.expandedTxBlock}>
        <Row>
          <Col layout="column" xs={6}>
            <Block className={cn(classes.txDataContainer, tx.type === INCOMING_TX_TYPE && classes.incomingTxBlock)}>
              <Block align="left" className={classes.txData}>
                <Bold className={classes.txHash}>Hash:</Bold>
                {tx.executionTxHash ? <EtherScanLink cut={8} type="tx" value={tx.executionTxHash} /> : 'n/a'}
              </Block>
              <Paragraph noMargin>
                <Bold>Nonce: </Bold>
                <Span>{tx.nonce}</Span>
              </Paragraph>
              <Paragraph noMargin>
                <Bold>Fee: </Bold>
                {tx.fee ? tx.fee : 'n/a'}
              </Paragraph>
              {tx.type === INCOMING_TX_TYPE ? (
                <>
                  <Paragraph noMargin>
                    <Bold>Created: </Bold>
                    {formatDate(tx.executionDate)}
                  </Paragraph>
                </>
              ) : (
                <>
                  <Paragraph noMargin>
                    <Bold>Created: </Bold>
                    {formatDate(tx.submissionDate)}
                  </Paragraph>
                  {tx.executionDate && (
                    <Paragraph noMargin>
                      <Bold>Executed: </Bold>
                      {formatDate(tx.executionDate)}
                    </Paragraph>
                  )}
                  {tx.refundParams && (
                    <Paragraph noMargin>
                      <Bold>Refund: </Bold>
                      max. {tx.refundParams.fee} {tx.refundParams.symbol}
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
            {tx.type === INCOMING_TX_TYPE ? <IncomingTxDescription tx={tx} /> : <TxDescription tx={tx} />}
          </Col>
          {tx.type !== INCOMING_TX_TYPE && (
            <OwnersColumn
              cancelThresholdReached={cancelThresholdReached}
              cancelTx={cancelTx}
              canExecute={canExecute}
              canExecuteCancel={canExecuteCancel}
              granted={granted}
              onTxConfirm={openApproveModal}
              onTxExecute={openApproveModal}
              onTxReject={openRejectModal}
              owners={owners}
              safeAddress={safeAddress}
              threshold={threshold}
              thresholdReached={thresholdReached}
              tx={tx}
              userAddress={userAddress}
            />
          )}
        </Row>
      </Block>
      {openModal === 'approveTx' && (
        <ApproveTxModal
          canExecute={canExecute}
          isOpen
          onClose={closeModal}
          processTransaction={processTransaction}
          safeAddress={safeAddress}
          threshold={threshold}
          thresholdReached={thresholdReached}
          tx={tx}
          userAddress={userAddress}
        />
      )}
      {openModal === 'rejectTx' && (
        <RejectTxModal
          createTransaction={createTransaction}
          isOpen
          onClose={closeModal}
          safeAddress={safeAddress}
          tx={tx}
        />
      )}
      {openModal === 'executeRejectTx' && (
        <ApproveTxModal
          canExecute={canExecuteCancel}
          isCancelTx
          isOpen
          onClose={closeModal}
          processTransaction={processTransaction}
          safeAddress={safeAddress}
          threshold={threshold}
          thresholdReached={cancelThresholdReached}
          tx={cancelTx}
          userAddress={userAddress}
        />
      )}
    </>
  )
}

export default ExpandedTx
