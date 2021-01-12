import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import React, { Fragment, ReactElement } from 'react'
import styled from 'styled-components'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { TxQueueRow, TxQueueGroupedRow } from './TxQueueRow'

const GroupedTransactions = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 3fr 3fr 1fr 2fr 2fr 2fr;
  width: 100%;

  .tree-lines {
    height: 100%;
    width: 20%;
    margin-left: 50%;
    position: relative;
    
    p {
      top: -33px;
      position: absolute;
      width: 100%;

      &::before {
        content: '';
        position: absolute;
        height: 30px;
        width: 100%;
        top: 0;
        border-left: 2px solid ${({ theme }) => theme.colors.separator};
        border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
      }
    }

    &:not(:last-of-type) {
      &::before {
        content: '';
        position: absolute;
        border-left: 2px solid ${({ theme }) => theme.colors.separator};
        border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
        margin-top: 10px;
        width: 100%;
        height: 100%;
      }
    }
  }

  .MuiAccordion-root {
    grid-column-start: 2;
    grid-column-end: span 6;
    border: 0;

    &:first-child {
      border: 0;
    }

    &.Mui-expanded {
      &:not(:last-of-type) {
        border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
      }

      &:not(:first-of-type) {
        margin-top: -2px;
        border-top: 2px solid ${({ theme }) => theme.colors.separator};
      }

      .MuiAccordionSummary-root {
        background-color: ${({ theme }) => theme.colors.white};
      }
    }
  }

  .tx-status {
    justify-self: end;
  }
}
`

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
                    <p className="tree-lines">{!index ? <p /> : null}</p>
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
