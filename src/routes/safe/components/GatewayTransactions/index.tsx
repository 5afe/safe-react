import { Menu, Tab } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { StoreStructure } from 'src/logic/safe/store/models/types/gateway'
import {
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import styled from 'styled-components'

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
  font-size: small;
`

type QueueTxListProps = {
  title: string
  transactions: StoreStructure['queued']['next'] | StoreStructure['queued']['queued']
}

const QueueTxList = ({ title, transactions }: QueueTxListProps): ReactElement => (
  <>
    <H2>{title}</H2>
    {Object.entries(transactions).map(([nonce, txs]) => {
      return (
        <React.Fragment key={nonce}>
          {txs.length === 1 ? (
            <div>{JSON.stringify(txs[0])}</div>
          ) : (
            txs.map((transaction) => <div key={transaction.id}>{JSON.stringify(transaction)}</div>)
          )}
        </React.Fragment>
      )
    })}
  </>
)

const items: Item[] = [
  { id: 'queue', label: 'Queue' },
  { id: 'history', label: 'History' },
]

const QueueTransactions = (): ReactElement => {
  const nextTxs = useSelector(nextTransactions) ?? {}
  const queuedTxs = useSelector(queuedTransactions) ?? {}
  const [txsCount, setTxsCount] = useState({ next: 0, queued: 0 })

  useEffect(() => {
    const next = Object.entries(nextTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
    const queued = Object.entries(queuedTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
    setTxsCount({ next, queued })
  }, [nextTxs, queuedTxs])

  return txsCount.next + txsCount.queued === 0 ? (
    <div>No txs</div>
  ) : (
    <>
      <QueueTxList title="Next Transaction" transactions={nextTxs} />
      {txsCount.queued !== 0 && <QueueTxList title="Queue" transactions={queuedTxs} />}
    </>
  )
}

type HistoryTxListProps = {
  transactions: StoreStructure['history']
}

const HistoryTxList = ({ transactions }: HistoryTxListProps): ReactElement => (
  <>
    {Object.entries(transactions).map(([timestamp, txs]) => (
      <React.Fragment key={timestamp}>
        <H2>{timestamp}</H2>
        {txs.map((transaction) => (
          <div key={transaction.id}>{JSON.stringify(transaction)}</div>
        ))}
      </React.Fragment>
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
