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
import { openTxInEtherScan } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { secondary } from '~/theme/variables'
import TxDescription from './TxDescription'
import OwnersColumn from './OwnersColumn'
import CancelTxModal from './CancelTxModal'
import ApproveTxModal from './ApproveTxModal'
import { styles } from './style'
import { formatDate } from '../columns'

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
  const thresholdReached = threshold <= tx.confirmations.size

  return (
    <>
      <Block>
        <Row>
          <Col xs={6} layout="column">
            <Block className={classes.txDataContainer}>
              <Paragraph noMargin>
                <Bold>TX hash: </Bold>
                {tx.executionTxHash ? (
                  <a href={openTxInEtherScan(tx.executionTxHash, 'rinkeby')} target="_blank" rel="noopener noreferrer">
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
            </Block>
            <Hairline />
            <TxDescription tx={tx} />
          </Col>
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
        </Row>
      </Block>
      <CancelTxModal
        isOpen={openModal === 'cancelTx'}
        createTransaction={createTransaction}
        onClose={closeModal}
        tx={tx}
        safeAddress={safeAddress}
      />
      <ApproveTxModal
        isOpen={openModal === 'approveTx'}
        processTransaction={processTransaction}
        onClose={closeModal}
        tx={tx}
        userAddress={userAddress}
        safeAddress={safeAddress}
        threshold={threshold}
        thresholdReached={thresholdReached}
      />
    </>
  )
}

export default withStyles(styles)(ExpandedTx)
