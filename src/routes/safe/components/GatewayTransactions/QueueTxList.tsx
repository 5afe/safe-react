import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import React, { Fragment, ReactElement, useContext } from 'react'

import { Transaction, TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import {
  DisclaimerContainer,
  GroupedTransactions,
  GroupedTransactionsCard,
  H2,
  StyledTransactions,
  StyledTransactionsGroup,
} from './styled'
import { TxHoverProvider } from './TxHoverProvider'
import { TxLocationContext } from './TxLocationProvider'
import { TxQueueRow } from './TxQueueRow'

const TreeView = ({ firstElement }: { firstElement: boolean }): ReactElement => {
  return <p className="tree-lines">{firstElement ? <span className="first-node" /> : null}</p>
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
}

const QueueTransaction = ({ nonce, transactions }: QueueTransactionProps): ReactElement => {
  return transactions.length > 1 ? (
    <GroupedTransactionsCard>
      <TxHoverProvider>
        <Disclaimer nonce={nonce} />
        <GroupedTransactions>
          {transactions.map((transaction, index) => (
            <Fragment key={`${nonce}-${transaction.id}`}>
              <TreeView firstElement={!index} />
              <TxQueueRow isGrouped transaction={transaction} />
            </Fragment>
          ))}
        </GroupedTransactions>
      </TxHoverProvider>
    </GroupedTransactionsCard>
  ) : (
    <TxQueueRow transaction={transactions[0]} />
  )
}

type QueueTxListProps = {
  transactions: TransactionDetails['transactions']
}

export const QueueTxList = ({ transactions }: QueueTxListProps): ReactElement => {
  const { txLocation } = useContext(TxLocationContext)
  const title = txLocation === 'queued.next' ? 'Next Transaction' : 'Queue'

  return (
    <StyledTransactionsGroup>
      <H2>{title}</H2>
      <StyledTransactions>
        {transactions.map(([nonce, txs]) => (
          <QueueTransaction key={nonce} nonce={nonce} transactions={txs} />
        ))}
      </StyledTransactions>
    </StyledTransactionsGroup>
  )
}
