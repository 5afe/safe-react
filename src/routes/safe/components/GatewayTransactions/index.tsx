import { Accordion, Loader, Menu, Tab, Text } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import { format } from 'date-fns'
import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactionDetails } from 'src/routes/safe/components/GatewayTransactions/Expanded/actions/fetchTransactionDetails'
import { getTransactionDetails } from 'src/routes/safe/components/GatewayTransactions/Expanded/selectors/getTransactionDetails'
import styled from 'styled-components'

import { isTransferTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import {
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import { getTxAmount } from './utils'
import { TxType } from './TxType'
import { TokenTransferAmount } from './Collapsed/TokenTransferAmount'

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

const StyledTransactionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 16px 0;
`

const StyledTransactions = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: #00000026 0 0 8px 2px;
  overflow: hidden;
  width: 100%;

  & .MuiAccordion-root {
    &:first-child {
      border-top: none;
    }
    &:last-child {
      border-bottom: none;
    }
  }

  & .MuiAccordionSummary-root {
    &.Mui-expanded {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`

const StyledTransaction = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 1fr 2fr 2fr 2fr;
  width: 100%;

  & > div {
    align-self: center;
  }

  & .tx-status {
    justify-self: end;
    margin-right: 8px;
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

const TxDetails = ({ transactionId }: { transactionId: string }): ReactElement => {
  const transactionDetails = useSelector((state) => getTransactionDetails(state, transactionId, 'history'))

  return transactionDetails ? <div>{JSON.stringify(transactionDetails)}</div> : <Loader size="md" />
}

const TxRow = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const [detailsView, setDetailsView] = useState(false)
  const dispatch = useDispatch()

  return (
    <Accordion
      id={transaction.id}
      onChange={(event, expanded, transactionId) => {
        setDetailsView(expanded)

        if (expanded && transactionId) {
          // lookup tx details
          dispatch(fetchTransactionDetails({ transactionId, txLocation: 'history' }))
        }
      }}
      summaryContent={
        <StyledTransaction>
          <div className="tx-nonce">
            <Text size="lg">{transaction.executionInfo?.nonce}</Text>
          </div>
          <div className="tx-type">
            <TxType tx={transaction} />
          </div>
          <div className="tx-info">
            {isTransferTxInfo(transaction.txInfo) && (
              <TokenTransferAmount
                direction={transaction.txInfo.direction}
                transferInfo={transaction.txInfo.transferInfo}
                amountWithSymbol={getTxAmount(transaction.txInfo)}
              />
            )}
          </div>
          <div className="tx-time">
            <Text size="lg">{format(transaction.timestamp, 'h:mm a')}</Text>
          </div>
          <div className="tx-votes" />
          <div className="tx-actions" />
          <div className="tx-status">
            <Text size="lg" color={transaction.txStatus === 'SUCCESS' ? 'primary' : 'error'} className="col" strong>
              {transaction.txStatus === 'SUCCESS' ? 'Success' : 'Fail'}
            </Text>
          </div>
        </StyledTransaction>
      }
      detailsContent={detailsView && <TxDetails transactionId={transaction.id} />}
    />
  )
}

const HistoryTxList = (): ReactElement => {
  const transactions = useSelector(historyTransactions)

  return (
    <>
      {transactions &&
        Object.entries(transactions).map(([timestamp, txs]) => (
          <StyledTransactionsGroup key={timestamp}>
            <H2>{format(Number(timestamp), 'MMM d, yyyy')}</H2>
            <StyledTransactions>
              {txs.map((transaction) => (
                <TxRow key={transaction.id} transaction={transaction} />
              ))}
            </StyledTransactions>
          </StyledTransactionsGroup>
        ))}
    </>
  )
}

const GatewayTransactions = (): ReactElement => {
  const [tab, setTab] = useState(items[0].id)

  return (
    <Wrapper>
      <Menu>
        <Breadcrumb />
      </Menu>
      <Tab items={items} onChange={setTab} selectedTab={tab} />
      <ContentWrapper>
        {tab === 'queue' && <QueueTransactions />}
        {tab === 'history' && <HistoryTxList />}
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
