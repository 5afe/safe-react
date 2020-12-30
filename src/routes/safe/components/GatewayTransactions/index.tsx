import { Menu, Tab, Text } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import { format } from 'date-fns'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { isTransferTxInfo, StoreStructure, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import {
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import { getTxAmount } from './utils'
import { TxType } from './TxType'
import { TokenTransferAmount } from './Row/TokenTransferAmount'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Breadcrumb = styled.div`
  height: 51px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
`

const H2 = styled.h2`
  text-transform: uppercase;
  font-size: smaller;
`

const TransactionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 16px 0;
`

const Table = styled.div`
  display: table;
  table-layout: fixed;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: #00000026 0 0 8px 2px;

  & > * {
    display: table-row;

    &:last-child {
      & > .col {
        border-bottom: none;
      }
    }

    & > .col {
      border-bottom: 1px solid lightgray;
      display: table-cell;
      padding: 12px;
    }
  }
`

type QueueTxListProps = {
  title: string
  transactions: TransactionDetails['transactions']
}

const QueueTxList = ({ title, transactions }: QueueTxListProps): ReactElement => (
  <>
    <H2>{title}</H2>
    {transactions.map(([nonce, txs]) => (
      <React.Fragment key={nonce}>
        {txs.length === 1 ? (
          <div>{JSON.stringify(txs[0])}</div>
        ) : (
          txs.map((transaction) => <div key={transaction.id}>{JSON.stringify(transaction)}</div>)
        )}
      </React.Fragment>
    ))}
  </>
)

type TransactionDetails = {
  count: number
  transactions: Array<[nonce: string, transactions: Transaction[]]>
}

type QueueTransactionsInfo = {
  next: TransactionDetails
  queue: TransactionDetails
}

const useQueueTransactions = (): QueueTransactionsInfo => {
  const nextTxs = useSelector(nextTransactions)
  const queuedTxs = useSelector(queuedTransactions)
  const [txsCount, setTxsCount] = useState({ next: 0, queued: 0 })

  useEffect(() => {
    const next = nextTxs
      ? Object.entries(nextTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0
    const queued = queuedTxs
      ? Object.entries(queuedTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0
    setTxsCount({ next, queued })
  }, [nextTxs, queuedTxs])

  return {
    next: {
      count: txsCount.next,
      transactions: nextTxs ? Object.entries(nextTxs) : [],
    },
    queue: {
      count: txsCount.queued,
      transactions: queuedTxs ? Object.entries(queuedTxs) : [],
    },
  }
}

const items: Item[] = [
  { id: 'queue', label: 'Queue' },
  { id: 'history', label: 'History' },
]

const QueueTransactions = (): ReactElement => {
  const { next, queue } = useQueueTransactions()

  return next.count + queue.count === 0 ? (
    <div>No txs</div>
  ) : (
    <>
      {next.transactions && <QueueTxList title="Next Transaction" transactions={next.transactions} />}
      {queue.transactions && <QueueTxList title="Queue" transactions={queue.transactions} />}
    </>
  )
}

type HistoryTxListProps = {
  transactions: StoreStructure['history']
}

const HistoryTxList = ({ transactions }: HistoryTxListProps): ReactElement => (
  <>
    {Object.entries(transactions).map(([timestamp, txs]) => (
      <TransactionsGroup key={timestamp}>
        <H2>{format(Number(timestamp), 'MMM d, yyyy')}</H2>
        <Table>
          {txs.map((transaction) => (
            <div key={transaction.id}>
              <Text size="sm" className="col">
                {transaction.executionInfo?.nonce}
              </Text>
              <div className="col">
                <TxType tx={transaction} />
              </div>
              <div className="col">
                {isTransferTxInfo(transaction.txInfo) && (
                  <TokenTransferAmount
                    direction={transaction.txInfo.direction}
                    transferInfo={transaction.txInfo.transferInfo}
                    amountWithSymbol={getTxAmount(transaction.txInfo)}
                  />
                )}
              </div>
              <Text size="sm" className="col">
                {format(transaction.timestamp, 'h:mm a')}
              </Text>
              <Text size="sm" color={transaction.txStatus === 'SUCCESS' ? 'primary' : 'error'} className="col" strong>
                {transaction.txStatus === 'SUCCESS' ? 'Success' : 'Fail'}
              </Text>
            </div>
          ))}
        </Table>
      </TransactionsGroup>
    ))}
  </>
)

const GatewayTransactions = (): ReactElement => {
  const historyTxs = useSelector(historyTransactions)
  const [tab, setTab] = useState(items[0].id)

  return (
    <Wrapper>
      <Menu>
        <Breadcrumb />
      </Menu>
      <Tab items={items} onChange={setTab} selectedTab={tab} />
      <ContentWrapper>
        {tab === 'queue' && <QueueTransactions />}
        {tab === 'history' && historyTxs && <HistoryTxList transactions={historyTxs} />}
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
