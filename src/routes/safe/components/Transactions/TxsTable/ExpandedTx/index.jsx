// @flow
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

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
import { INCOMING_TX_TYPES } from '~/routes/safe/store/models/incomingTransaction'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { safeNonceSelector, safeThresholdSelector } from '~/routes/safe/store/selectors'

type Props = {
  tx: Transaction,
  cancelTx: Transaction,
}

type OpenModal = 'rejectTx' | 'approveTx' | 'executeRejectTx' | null

const useStyles = makeStyles(styles)

const ExpandedTx = ({ cancelTx, tx }: Props) => {
  const classes = useStyles()
  const nonce = useSelector(safeNonceSelector)
  const threshold = useSelector(safeThresholdSelector)
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  const openApproveModal = () => setOpenModal('approveTx')
  const closeModal = () => setOpenModal(null)
  const isIncomingTx = !!INCOMING_TX_TYPES[tx.type]
  const isCreationTx = tx.type === 'creation'

  const thresholdReached = !isIncomingTx && threshold <= tx.confirmations.size
  const canExecute = !isIncomingTx && nonce === tx.nonce
  const cancelThresholdReached = !!cancelTx && threshold <= cancelTx.confirmations.size
  const canExecuteCancel = nonce === tx.nonce

  const openRejectModal = () => {
    if (!!cancelTx && nonce === cancelTx.nonce) {
      setOpenModal('executeRejectTx')
    } else {
      setOpenModal('rejectTx')
    }
  }

  const RenderIncomingTx = ({ tx }) => {
    if (!tx || !isIncomingTx) return null
    return (
      <>
        <Paragraph noMargin>
          <Bold>Created: </Bold>
          {formatDate(tx.executionDate)}
        </Paragraph>
      </>
    )
  }

  const RenderOutgoingTx = ({ tx }) => {
    if (!tx || !(tx.type === 'outgoing')) return null
    return (
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
    )
  }

  const RenderCreationTx = ({ tx }) => {
    if (!tx || !isCreationTx) return null

    return (
      <>
        <Paragraph noMargin>
          <Bold>Created: </Bold>
          {formatDate(tx.created)}
        </Paragraph>
        <Paragraph noMargin>
          <Bold>Creator: </Bold>
          {tx.creator}
        </Paragraph>
        <Paragraph noMargin>
          <Bold>Factory: </Bold>
          {tx.factoryAddress}
        </Paragraph>
        <Paragraph noMargin>
          <Bold>Mastercopy: </Bold>
          {tx.masterCopy}
        </Paragraph>
      </>
    )
  }

  return (
    <>
      <Block className={classes.expandedTxBlock}>
        <Row>
          <Col layout="column" xs={6}>
            <Block className={cn(classes.txDataContainer, (isIncomingTx || isCreationTx) && classes.incomingTxBlock)}>
              <Block align="left" className={classes.txData}>
                <Bold className={classes.txHash}>Hash:</Bold>
                {tx.executionTxHash ? <EtherScanLink cut={8} type="tx" value={tx.executionTxHash} /> : 'n/a'}
              </Block>
              {!isIncomingTx && !isCreationTx && (
                <Paragraph noMargin>
                  <Bold>Nonce: </Bold>
                  <Span>{tx.nonce}</Span>
                </Paragraph>
              )}
              {!isCreationTx ? (
                <Paragraph noMargin>
                  <Bold>Fee: </Bold>
                  {tx.fee ? tx.fee : 'n/a'}
                </Paragraph>
              ) : null}
              <RenderCreationTx tx={tx} />
              <RenderIncomingTx tx={tx} />
              <RenderOutgoingTx tx={tx} />
            </Block>
            <Hairline />
            {isIncomingTx && <IncomingTxDescription tx={tx} />}
            {!isIncomingTx && !isCreationTx && <TxDescription tx={tx} />}
            {isCreationTx && <Block className={classes.emptyRowDataContainer} />}
          </Col>
          {!isIncomingTx && !isCreationTx && (
            <OwnersColumn
              cancelThresholdReached={cancelThresholdReached}
              cancelTx={cancelTx}
              canExecute={canExecute}
              canExecuteCancel={canExecuteCancel}
              onTxConfirm={openApproveModal}
              onTxExecute={openApproveModal}
              onTxReject={openRejectModal}
              thresholdReached={thresholdReached}
              tx={tx}
            />
          )}
        </Row>
      </Block>
      {openModal === 'approveTx' && (
        <ApproveTxModal
          canExecute={canExecute}
          isOpen
          onClose={closeModal}
          thresholdReached={thresholdReached}
          tx={tx}
        />
      )}
      {openModal === 'rejectTx' && <RejectTxModal isOpen onClose={closeModal} tx={tx} />}
      {openModal === 'executeRejectTx' && (
        <ApproveTxModal
          canExecute={canExecuteCancel}
          isCancelTx
          isOpen
          onClose={closeModal}
          thresholdReached={cancelThresholdReached}
          tx={cancelTx}
        />
      )}
    </>
  )
}

export default ExpandedTx
