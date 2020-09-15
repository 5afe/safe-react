import cn from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import {
  getModuleAmount,
  TableData,
  TX_TABLE_RAW_CANCEL_TX_ID,
  TX_TABLE_RAW_TX_ID,
} from 'src/routes/safe/components/Transactions/TxsTable/columns'

import ApproveTxModal from './ApproveTxModal'
import OwnersColumn from './OwnersColumn'
import RejectTxModal from './RejectTxModal'
import TxDescription from './TxDescription'
import { IncomingTx } from './IncomingTx'
import { CreationTx } from './CreationTx'
import { OutgoingTx } from './OutgoingTx'
import useStyles from './style'

import { getNetwork } from 'src/config'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Span from 'src/components/layout/Span'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { INCOMING_TX_TYPES } from 'src/logic/safe/store/models/incomingTransaction'
import { safeNonceSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'
import { Transaction, TransactionTypes, SafeModuleTransaction } from 'src/logic/safe/store/models/types/transaction'
import IncomingTxDescription from './IncomingTxDescription'
import TransferDescription from './TxDescription/TransferDescription'

const ExpandedModuleTx = ({ tx }: { tx: SafeModuleTransaction }): React.ReactElement => {
  const classes = useStyles()

  const recipient = React.useMemo(() => {
    if (tx.type === TransactionTypes.SPENDING_LIMIT) {
      if (tx.dataDecoded) {
        // if `dataDecoded` is defined, then it's a token transfer
        return tx.dataDecoded?.parameters[0].value
      } else {
        // if `data` is not defined, then it's an ETH transfer
        return tx.to
      }
    }
  }, [tx.dataDecoded, tx.to, tx.type])

  return (
    <Block className={classes.expandedTxBlock}>
      <Row>
        <Col layout="column" xs={6}>
          <Block className={cn(classes.txDataContainer, classes.incomingTxBlock)}>
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
          </Block>
          <Hairline />
          <Block className={cn(classes.txDataContainer, classes.incomingTxBlock)}>
            {recipient && <TransferDescription amount={getModuleAmount(tx)} recipient={recipient} />}
          </Block>
        </Col>
      </Row>
    </Block>
  )
}

interface ExpandedTxProps {
  cancelTx?: Transaction
  tx: Transaction
}

const ExpandedTx = ({ cancelTx, tx }: ExpandedTxProps): React.ReactElement => {
  const { fromWei, toBN } = getWeb3().utils

  const classes = useStyles()
  const nonce = useSelector(safeNonceSelector)
  const threshold = useSelector(safeThresholdSelector) as number
  const [openModal, setOpenModal] = useState<'approveTx' | 'executeRejectTx' | 'rejectTx'>()
  const openApproveModal = () => setOpenModal('approveTx')
  const closeModal = () => setOpenModal(undefined)
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
                  {tx.fee ? fromWei(toBN(tx.fee)) + ' ETH' : 'n/a'}
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
      {openModal === 'executeRejectTx' && cancelTx && (
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

const ExpandedTxRow = ({ row }: { row: TableData }): React.ReactElement => {
  const isModuleTx = [TransactionTypes.SPENDING_LIMIT, TransactionTypes.MODULE].includes(row.tx.type)

  if (isModuleTx) {
    return <ExpandedModuleTx tx={row[TX_TABLE_RAW_TX_ID] as SafeModuleTransaction} />
  }

  return <ExpandedTx cancelTx={row[TX_TABLE_RAW_CANCEL_TX_ID]} tx={row[TX_TABLE_RAW_TX_ID] as Transaction} />
}

export default ExpandedTxRow
