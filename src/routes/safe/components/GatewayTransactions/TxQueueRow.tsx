import { AccordionDetails, AccordionSummary } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway'
import { useTransactionDetails } from './hooks/useTransactionDetails'
import { TxQueuedCollapsed, TxQueuedGroupedCollapsed } from './TxQueueCollapsed'
import { NoPaddingAccordion } from './styled'
import { TxDetails } from './TxDetails'

export const TxQueueRow = ({
  transaction,
  txLocation,
}: {
  transaction: Transaction
  txLocation: 'queued.next' | 'queued.queued'
}): ReactElement => {
  const { data, loading } = useTransactionDetails(transaction.id, txLocation)

  return (
    <NoPaddingAccordion
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
    >
      <AccordionSummary>
        <TxQueuedCollapsed transaction={transaction} />
      </AccordionSummary>
      <AccordionDetails>
        <TxDetails data={data} loading={loading} />
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}

export const TxQueueGroupedRow = ({
  className,
  transaction,
  txLocation,
}: {
  className: string
  transaction: Transaction
  txLocation: 'queued.next' | 'queued.queued'
}): ReactElement => {
  const { data, loading } = useTransactionDetails(transaction.id, txLocation)

  return (
    <NoPaddingAccordion
      className={className}
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
    >
      <AccordionSummary>
        <TxQueuedGroupedCollapsed transaction={transaction} />
      </AccordionSummary>
      <AccordionDetails>
        <TxDetails data={data} loading={loading} />
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
