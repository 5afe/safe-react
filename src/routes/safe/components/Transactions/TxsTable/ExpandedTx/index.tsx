import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'

import ApproveTxModal from './ApproveTxModal'
import OwnersColumn from './OwnersColumn'
import RejectTxModal from './RejectTxModal'
import TxDescription from './TxDescription'
import { IncomingTx } from './IncomingTx'
import { CreationTx } from './CreationTx'
import { OutgoingTx } from './OutgoingTx'
import { styles } from './style'

import { getNetwork } from 'src/config'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Span from 'src/components/layout/Span'
import { INCOMING_TX_TYPES } from 'src/logic/safe/store/models/incomingTransaction'
import { safeNonceSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'
import { Transaction, TransactionTypes } from 'src/logic/safe/store/models/types/transaction'
import IncomingTxDescription from './IncomingTxDescription'

const useStyles = makeStyles(styles as any)

interface ExpandedTxProps {
  cancelTx: Transaction
  tx: Transaction
}

const ExpandedTx = ({ cancelTx, tx }: ExpandedTxProps): React.ReactElement => {
  const classes = useStyles()
  const nonce = useSelector(safeNonceSelector)
  const threshold = useSelector(safeThresholdSelector)
  const [openModal, setOpenModal] = useState(null)
  const openApproveModal = () => setOpenModal('approveTx')
  const closeModal = () => setOpenModal(null)
  const isIncomingTx = !!INCOMING_TX_TYPES[tx.type]
  const isCreationTx = tx.type === TransactionTypes.CREATION

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

  return (
    <>
      <Block className={classes.expandedTxBlock}>
        <Row>
          <Col layout="column" xs={6}>
            <Block className={cn(classes.txDataContainer, (isIncomingTx || isCreationTx) && classes.incomingTxBlock)}>
              <div style={{ display: 'flex' }}>
                <Bold className={classes.txHash}>Hash:</Bold>
                {tx.executionTxHash ? (
                  <EthHashInfo
                    hash={tx.executionTxHash}
                    shortenHash={4}
                    showCopyBtn
                    showEtherscanBtn
                    network={getNetwork()}
                  />
                ) : (
                  'n/a'
                )}
              </div>
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
              <CreationTx tx={tx} />
              <IncomingTx tx={tx} />
              <OutgoingTx tx={tx} />
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
