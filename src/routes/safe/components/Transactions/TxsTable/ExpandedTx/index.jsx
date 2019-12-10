// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Span from '~/components/layout/Span'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { secondary } from '~/theme/variables'
import TxDescription from './TxDescription'
import OwnersColumn from './OwnersColumn'
import CancelTxModal from './CancelTxModal'
import ApproveTxModal from './ApproveTxModal'
import { styles } from './style'
import { formatDate } from '../columns'
import IncomingTxDescription from '~/routes/safe/components/Transactions/TxsTable/ExpandedTx/IncomingTxDescription'
import { INCOMING_TX_TYPE } from '~/routes/safe/store/models/incomingTransaction'

type Props = {
  classes: Object,
  tx: Transaction,
  threshold: number,
  owners: List<Owner>,
  granted: boolean,
  userAddress: string,
  safeAddress: string,
  createTransaction: Function,
  processTransaction: Function,
}

type OpenModal = 'cancelTx' | 'approveTx' | null

const openIconStyle = {
  height: '13px',
  color: secondary,
}

const txStatusToLabel = {
  success: 'Success',
  awaiting_confirmations: 'Awaiting confirmations',
  cancelled: 'Cancelled',
  awaiting_execution: 'Awaiting execution',
}

const ExpandedTx = ({
  classes,
  tx,
  threshold,
  owners,
  granted,
  userAddress,
  safeAddress,
  createTransaction,
  processTransaction,
}: Props) => {
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  const openApproveModal = () => setOpenModal('approveTx')
  const openCancelModal = () => setOpenModal('cancelTx')
  const closeModal = () => setOpenModal(null)
  const thresholdReached = tx.type !== INCOMING_TX_TYPE && threshold <= tx.confirmations.size

  return (
    <>
      <Block>
        <Row>
          <Col xs={6} layout="column">
            <Block className={classes.txDataContainer} style={tx.type === INCOMING_TX_TYPE ? { borderRight: '2px solid rgb(232, 231, 230)' } : {}}>
              <Paragraph noMargin>
                <Bold>TX hash: </Bold>
                {tx.executionTxHash ? (
                  <a href={getEtherScanLink('tx', tx.executionTxHash)} target="_blank" rel="noopener noreferrer">
                    {shortVersionOf(tx.executionTxHash, 4)}
                    <OpenInNew style={openIconStyle} />
                  </a>
                ) : (
                  'n/a'
                )}
              </Paragraph>
              <Paragraph noMargin>
                <Bold>TX status: </Bold>
                <Span className={classes[tx.status]} style={{ fontWeight: 'bold' }}>
                  {txStatusToLabel[tx.status]}
                </Span>
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
            {tx.type === INCOMING_TX_TYPE ? <IncomingTxDescription tx={tx} /> : <TxDescription tx={tx} />}
          </Col>
          {tx.type !== INCOMING_TX_TYPE && (
            <OwnersColumn
              tx={tx}
              owners={owners}
              granted={granted}
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

export default withStyles(styles)(ExpandedTx)
