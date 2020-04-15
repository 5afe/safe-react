// @flow
import { makeStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import ApproveTxModal from './ApproveTxModal'
import OwnersColumn from './OwnersColumn'
import RejectTxModal from './RejectTxModal'
import TxDescription from './TxDescription'
import { styles } from './style'

import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Row from '~/components/layout/Row'
import IncomingTxDescription from '~/routes/safe/components/Transactions/TxsTable/ExpandedTx/IncomingTxDescription'
import { TxDetails } from '~/routes/safe/components/Transactions/TxsTable/ExpandedTx/TxDetails'
import updateTransaction from '~/routes/safe/store/actions/updateTransaction'
import { INCOMING_TX_TYPES } from '~/routes/safe/store/models/incomingTransaction'
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
  const dispatch = useDispatch()
  const openApproveModal = () => setOpenModal('approveTx')
  const closeModal = () => setOpenModal(null)
  const thresholdReached = !INCOMING_TX_TYPES.includes(tx.type) && threshold <= tx.confirmations.size
  const canExecute = !INCOMING_TX_TYPES.includes(tx.type) && nonce === tx.nonce
  const cancelThresholdReached = !!cancelTx && threshold <= cancelTx.confirmations.size
  const canExecuteCancel = nonce === tx.nonce

  const openRejectModal = () => {
    if (!!cancelTx && nonce === cancelTx.nonce) {
      setOpenModal('executeRejectTx')
    } else {
      setOpenModal('rejectTx')
    }
  }

  const addPendingActionToTx = () => {
    const currentPendingActions = tx.ownersWithPendingActions.push(userAddress)
    dispatch(updateTransaction({ safeAddress, transaction: tx.set('ownersWithPendingActions', currentPendingActions) }))
  }

  return (
    <>
      <Block className={classes.expandedTxBlock}>
        <Row>
          <Col layout="column" xs={6}>
            <TxDetails tx={tx} />
            <Hairline />
            {INCOMING_TX_TYPES.includes(tx.type) ? <IncomingTxDescription tx={tx} /> : <TxDescription tx={tx} />}
          </Col>
          {!INCOMING_TX_TYPES.includes(tx.type) && (
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
          addPendingActionToTx={addPendingActionToTx}
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
          addPendingActionToTx={addPendingActionToTx}
          createTransaction={createTransaction}
          isOpen
          onClose={closeModal}
          safeAddress={safeAddress}
          tx={tx}
        />
      )}
      {openModal === 'executeRejectTx' && (
        <ApproveTxModal
          addPendingActionToTx={addPendingActionToTx}
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
