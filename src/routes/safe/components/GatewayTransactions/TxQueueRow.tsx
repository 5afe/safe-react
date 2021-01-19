import { AccordionDetails, AccordionSummary } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TxQueueCollapsed } from './TxQueueCollapsed'
import { NoPaddingAccordion } from './styled'
import { TxDetails } from './TxDetails'

type TxQueueRowProps = {
  isGrouped?: boolean
  transaction: Transaction
  txLocation: 'queued.next' | 'queued.queued'
}

export const TxQueueRow = ({ isGrouped = false, transaction, txLocation }: TxQueueRowProps): ReactElement => (
  <NoPaddingAccordion
    TransitionProps={{
      mountOnEnter: false,
      unmountOnExit: true,
      appear: true,
    }}
  >
    <AccordionSummary>
      <TxQueueCollapsed isGrouped={isGrouped} transaction={transaction} txLocation={txLocation} />
    </AccordionSummary>
    <AccordionDetails>
      <TxDetails transaction={transaction} txLocation={txLocation} />
    </AccordionDetails>
  </NoPaddingAccordion>
)
