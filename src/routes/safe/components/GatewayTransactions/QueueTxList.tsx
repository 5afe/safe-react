import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import React, { Fragment, ReactElement } from 'react'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { Disclaimer, GroupedTransactions, H2, StyledTransactions, StyledTransactionsGroup } from './styled'
import { TxQueueGroupedRow, TxQueueRow } from './TxQueueRow'

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
        {transactions.map(([nonce, txs]) =>
          txs.length > 1 ? (
            <>
              <Disclaimer>
                <Text size="lg" className="nonce">
                  {nonce}
                </Text>
                <Text size="lg" className="disclaimer">
                  These transactions conflict as they use the same nonce. Executing one will automatically replace the
                  other(s).{' '}
                  <Link href="https://gnosis.io" target="_blank" rel="noreferrer" title="nonces">
                    <Text size="lg" as="span" color="primary">
                      Learn more
                    </Text>
                    <Icon size="sm" type="externalLink" color="primary" />
                  </Link>
                </Text>
              </Disclaimer>
              <GroupedTransactions key={nonce}>
                {txs.map((transaction, index) => (
                  <Fragment key={`${nonce}-${transaction.id}`}>
                    <p className="tree-lines">{!index ? <p className="first-node" /> : null}</p>
                    <TxQueueGroupedRow transaction={transaction} txLocation={txLocation} />
                  </Fragment>
                ))}
              </GroupedTransactions>
            </>
          ) : (
            <TxQueueRow transaction={txs[0]} txLocation={txLocation} />
          ),
        )}
      </StyledTransactions>
    </StyledTransactionsGroup>
  )
}
