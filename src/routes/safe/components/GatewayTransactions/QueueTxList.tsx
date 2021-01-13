import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import React, { Fragment, ReactElement } from 'react'

import { Transaction, TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { DisclaimerContainer, GroupedTransactions, H2, StyledTransactions, StyledTransactionsGroup } from './styled'
import { TxQueueGroupedRow, TxQueueRow } from './TxQueueRow'

const TreeView = ({ firstElement }: { firstElement: boolean }): ReactElement => {
  return <p className="tree-lines">{firstElement ? <p className="first-node" /> : null}</p>
}

const Disclaimer = ({ nonce }: { nonce: string }): ReactElement => {
  return (
    <DisclaimerContainer>
      <Text size="lg" className="nonce">
        {nonce}
      </Text>
      <Text size="lg" className="disclaimer">
        These transactions conflict as they use the same nonce. Executing one will automatically replace the other(s).{' '}
        <Link href="https://gnosis.io" target="_blank" rel="noreferrer" title="nonces">
          <Text size="lg" as="span" color="primary">
            Learn more
          </Text>
          <Icon size="sm" type="externalLink" color="primary" />
        </Link>
      </Text>
    </DisclaimerContainer>
  )
}

type QueueTransactionProps = {
  nonce: string
  transactions: Transaction[]
  txLocation: 'queued.next' | 'queued.queued'
}

const QueueTransaction = ({ nonce, transactions, txLocation }: QueueTransactionProps): ReactElement => {
  return transactions.length > 1 ? (
    <>
      <Disclaimer nonce={nonce} />
      <GroupedTransactions>
        {transactions.map((transaction, index) => (
          <Fragment key={`${nonce}-${transaction.id}`}>
            <TreeView firstElement={!index} />
            <TxQueueGroupedRow transaction={transaction} txLocation={txLocation} />
          </Fragment>
        ))}
      </GroupedTransactions>
    </>
  ) : (
    <TxQueueRow transaction={transactions[0]} txLocation={txLocation} />
  )
}

type QueueTxListProps = {
  txLocation: 'queued.next' | 'queued.queued'
  transactions: TransactionDetails['transactions']
}

export const QueueTxList = ({ txLocation, transactions }: QueueTxListProps): ReactElement => {
  const title = txLocation === 'queued.next' ? 'Next Transaction' : 'Queue'

  return (
    <StyledTransactionsGroup>
      <H2>{title}</H2>
      <StyledTransactions>
        {transactions.map(([nonce, txs]) => (
          <QueueTransaction key={nonce} nonce={nonce} transactions={txs} txLocation={txLocation} />
        ))}
      </StyledTransactions>
    </StyledTransactionsGroup>
  )
}
