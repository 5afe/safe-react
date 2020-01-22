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
  threshold: number,
  owners: List<Owner>,
  granted: boolean,
  userAddress: string,
  safeAddress: string,
  createTransaction: Function,
  processTransaction: Function,
  nonce: number
}

type OpenModal = "cancelTx" | "approveTx" | null

const useStyles = makeStyles(styles)

const ExpandedTx = ({
  tx,
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
  const openCancelModal = () => setOpenModal('cancelTx')
  const closeModal = () => setOpenModal(null)
  const thresholdReached = tx.type !== INCOMING_TX_TYPE && threshold <= tx.confirmations.size
  const canExecute = tx.type !== INCOMING_TX_TYPE && nonce === tx.nonce

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
                <Bold className={classes.txHash}>Hash:</Bold>
                {tx.executionTxHash ? (
                  <EtherScanLink type="tx" value={tx.executionTxHash} cut={8} />
                ) : (
                  'n/a'
                )}
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
              owners={owners}
              granted={granted}
              canExecute={canExecute}
              threshold={threshold}
              userAddress={userAddress}
              thresholdReached={thresholdReached}
              safeAddress={safeAddress}
              onTxConfirm={openApproveModal}
              onTxCancel={openCancelModal}
              onTxExecute={openApproveModal}
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
    </>
  )
}

export default ExpandedTx
