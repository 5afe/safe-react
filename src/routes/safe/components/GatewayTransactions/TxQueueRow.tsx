import { AccordionDetails, AccordionSummary } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway'
import { TxQueuedCollapsed, TxQueuedGroupedCollapsed } from './TxQueueCollapsed'
import { NoPaddingAccordion } from './styled'
import { TxDetails } from './TxDetails'

export const TxQueueRow = ({
  transaction,
  txLocation,
}: {
  transaction: Transaction
  txLocation: 'queued.next' | 'queued.queued'
}): ReactElement => (
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
      <TxDetails transactionId={transaction.id} txLocation={txLocation} />
    </AccordionDetails>
  </NoPaddingAccordion>
)

export const TxQueueGroupedRow = ({
  transaction,
  txLocation,
}: {
  transaction: Transaction
  txLocation: 'queued.next' | 'queued.queued'
}): ReactElement => (
  <NoPaddingAccordion
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
      <TxDetails transactionId={transaction.id} txLocation={txLocation} />
    </AccordionDetails>
  </NoPaddingAccordion>
)
