import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { TxQueueRow, TxQueueGroupedRow } from 'src/routes/safe/components/GatewayTransactions/TxQueueRow'
import { H2, StyledTransactions, StyledTransactionsGroup } from './styled'

const Disclaimer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  display: grid;
  grid-template-columns: 0.5fr 3fr 3fr 1fr 2fr 2fr 2fr;
  border-radius: 5px;
  margin: 8px;
  padding: 8px;
  width: calc(100% - 32px);

  .nonce {
    grid-column-start: 1;
  }

  .disclaimer {
    grid-column-start: 2;
    grid-column-end: span 6;
  }
`

const GroupedTransactions = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 3fr 3fr 1fr 2fr 2fr 2fr;
  width: 100%;

  .tx-row {
    grid-column-start: 2;
    grid-column-end: span 6;
    border: 0;

    &:first-child {
      border: 0;
    }

    &.Mui-expanded:not(:last-child) {
      border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
    }

    .MuiAccordionSummary-root.Mui-expanded {
      background-color: transparent;
    }

    .tx-status {
      justify-self: end;
    }
  }
`

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
                  <Text size="lg" as="span" color="primary">
                    Learn more
                  </Text>
                </Text>
              </Disclaimer>
              <GroupedTransactions key={nonce}>
                {txs.map((transaction) => (
                  <TxQueueGroupedRow
                    className="tx-row"
                    key={`${nonce}-${transaction.id}`}
                    transaction={transaction}
                    txLocation={txLocation}
                  />
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
