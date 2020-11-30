import { EthHashInfo, Loader } from '@gnosis.pm/safe-react-components'
import axios, { AxiosResponse } from 'axios'
import cn from 'classnames'
import memoize from 'lodash/memoize'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import ApproveTxModal from './ApproveTxModal'
import OwnersColumn from './OwnersColumn'
import RejectTxModal from './RejectTxModal'
import TxDescription from './TxDescription'
import { IncomingTx } from './IncomingTx'
import { CreationTx } from './CreationTx'
import { OutgoingTx } from './OutgoingTx'
import useStyles from './style'

import {
  getModuleAmount,
  NOT_AVAILABLE,
  TableData,
  TX_TABLE_RAW_CANCEL_TX_ID,
  TX_TABLE_RAW_TX_ID,
} from 'src/routes/safe/components/Transactions/TxsTable/columns'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Span from 'src/components/layout/Span'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { Transaction, TransactionTypes, SafeModuleTransaction } from 'src/logic/safe/store/models/types/transaction'
import IncomingTxDescription from './IncomingTxDescription'
import { getExplorerInfo, getNetworkInfo, getTxDetailsUrl } from 'src/config'
import TransferDescription from './TxDescription/TransferDescription'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { safeNonceSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'
import { TransactionSummary, Transfer } from 'src/logic/safe/store/models/types/gateway'
import { isGatewayTransaction } from 'src/logic/safe/store/models/types/gatewayHelpers'

const ExpandedModuleTx = ({ tx }: { tx: SafeModuleTransaction }): ReactElement => {
  const classes = useStyles()

  const recipient = useMemo(() => {
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

  const amountWithSymbol = getModuleAmount(tx)

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
                  showCopyBtn
                  explorerUrl={getExplorerInfo(tx.executionTxHash)}
                  shortenHash={4}
                />
              ) : (
                'n/a'
              )}
            </div>
          </Block>
          <Hairline />
          <Block className={cn(classes.txDataContainer, classes.incomingTxBlock)}>
            {recipient && (
              <TransferDescription
                amountWithSymbol={amountWithSymbol}
                isTokenTransfer={!sameAddress(amountWithSymbol, NOT_AVAILABLE)}
                recipient={recipient}
              />
            )}
          </Block>
        </Col>
      </Row>
    </Block>
  )
}

interface ExpandedSafeTxProps {
  cancelTx?: Transaction
  tx: Transaction
}

const { nativeCoin } = getNetworkInfo()

const ExpandedSafeTx = ({ cancelTx, tx }: ExpandedSafeTxProps): ReactElement => {
  const { fromWei, toBN } = getWeb3().utils
  const classes = useStyles()
  const nonce = useSelector(safeNonceSelector)
  const threshold = useSelector(safeThresholdSelector) as number
  const [openModal, setOpenModal] = useState<'approveTx' | 'executeRejectTx' | 'rejectTx'>()
  const openApproveModal = () => setOpenModal('approveTx')
  const closeModal = () => setOpenModal(undefined)
  const isCreationTx = tx.type === TransactionTypes.CREATION

  const thresholdReached = threshold <= tx.confirmations.size
  const canExecute = nonce === tx.nonce
  const cancelThresholdReached = !!cancelTx && threshold <= cancelTx.confirmations.size
  const canExecuteCancel = nonce === tx.nonce

  const openRejectModal = () => {
    if (!!cancelTx && nonce === cancelTx.nonce) {
      setOpenModal('executeRejectTx')
    } else {
      setOpenModal('rejectTx')
    }
  }

  const explorerUrl = tx.executionTxHash ? getExplorerInfo(tx.executionTxHash) : null

  return (
    <>
      <Block className={classes.expandedTxBlock}>
        <Row>
          <Col layout="column" xs={6} className={classes.col}>
            <Block className={cn(classes.txDataContainer, isCreationTx && classes.incomingTxBlock)}>
              <div style={{ display: 'flex' }}>
                <Bold className={classes.txHash}>Hash:</Bold>
                {tx.executionTxHash ? (
                  <EthHashInfo hash={tx.executionTxHash} shortenHash={4} showCopyBtn explorerUrl={explorerUrl} />
                ) : (
                  'n/a'
                )}
              </div>
              {!isCreationTx && (
                <Paragraph noMargin>
                  <Bold>Nonce: </Bold>
                  <Span>{tx.nonce}</Span>
                </Paragraph>
              )}
              {!isCreationTx ? (
                <Paragraph noMargin>
                  <Bold>Fee: </Bold>
                  {tx.fee ? fromWei(toBN(tx.fee)) + ` ${nativeCoin.name}` : 'n/a'}
                </Paragraph>
              ) : null}
              <CreationTx tx={tx} />
              <OutgoingTx tx={tx} />
            </Block>
            <Hairline />
            {!isCreationTx && <TxDescription tx={tx} />}
            {isCreationTx && <Block className={classes.emptyRowDataContainer} />}
          </Col>
          {!isCreationTx && (
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

// TODO: WIP -- this is here for ease of implementation
//  it should be implemented as a selector
//  also, `ExpandedTxDetails` type, is incomplete and should be defined inside `gateway.d.ts`
//{
// executedAt: 1604098453000,
// txStatus: "SUCCESS",
// txInfo: {},
// txData: null,
// detailedExecutionInfo: null,
// txHash: "0xaff6465ba25f0bc48f26299b74e12c0bc41d614e2995fdacce50066bb4b934dd"
// }

type ExpandedTxDetails = {
  executedAt: number
  txStatus: string
  txInfo: any
  txData: string | null
  detailedExecutionInfo: any | null
  txHash: string
}

const txDetailedInfo = memoize(
  async (transaction: TransactionSummary): Promise<ExpandedTxDetails> => {
    const url = getTxDetailsUrl(transaction.id)
    const { data } = await axios.get<ExpandedTxDetails, AxiosResponse<ExpandedTxDetails>>(url)
    return data
  },
  (transaction: TransactionSummary) => {
    return `${transaction.txStatus}-${transaction.id}`
  },
)

const IncomingGatewayTx = ({
  timestamp,
  transferTx,
  txHash = null,
}: {
  timestamp: TransactionSummary['timestamp']
  transferTx: Transfer
  txHash: string | null
}): ReactElement => {
  const classes = useStyles()

  return (
    <>
      <Block className={cn(classes.txDataContainer, classes.incomingTxBlock)}>
        <div style={{ display: 'flex' }}>
          <Bold className={classes.txHash}>Hash: </Bold>
          {txHash ? (
            <EthHashInfo hash={txHash} shortenHash={4} showCopyBtn explorerUrl={getExplorerInfo(txHash)} />
          ) : (
            <Loader size="xs" />
          )}
        </div>
        <IncomingTx timestamp={timestamp} />
      </Block>
      <Hairline />
      <IncomingTxDescription transferTx={transferTx} />
    </>
  )
}

const ExpandedGatewayTx = ({ tx }: { tx: TransactionSummary }): ReactElement | null => {
  const classes = useStyles()
  const isIncomingTx = tx.txInfo.type === 'Transfer' && tx.txInfo.direction === 'INCOMING'

  const [txHash, setTxHash] = useState<string | null>(null)
  useEffect(() => {
    if (tx.id) {
      txDetailedInfo(tx)
        .then(({ txHash }) => setTxHash(txHash))
        .catch((error) => {
          console.error('Failed to retrieve tx details', error, tx)
          setTxHash(NOT_AVAILABLE)
        })
    }
  }, [tx])

  if (isIncomingTx) {
    return (
      <Block className={classes.expandedTxBlock}>
        <Row>
          <Col layout="column" xs={6} className={classes.col}>
            {isIncomingTx && (
              <IncomingGatewayTx timestamp={tx.timestamp} transferTx={tx.txInfo as Transfer} txHash={txHash} />
            )}
          </Col>
        </Row>
      </Block>
    )
  }

  return null
}

export const ExpandedTx = ({ row }: { row: TableData }): ReactElement => {
  if (isGatewayTransaction(row.tx)) {
    return <ExpandedGatewayTx tx={row[TX_TABLE_RAW_TX_ID] as TransactionSummary} />
  }

  const isModuleTx = [TransactionTypes.SPENDING_LIMIT, TransactionTypes.MODULE].includes(
    (row.tx as Transaction | SafeModuleTransaction).type,
  )

  if (isModuleTx) {
    return <ExpandedModuleTx tx={row[TX_TABLE_RAW_TX_ID] as SafeModuleTransaction} />
  }

  return <ExpandedSafeTx cancelTx={row[TX_TABLE_RAW_CANCEL_TX_ID]} tx={row[TX_TABLE_RAW_TX_ID] as Transaction} />
}
