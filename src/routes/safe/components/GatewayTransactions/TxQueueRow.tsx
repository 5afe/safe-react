import { AccordionDetails, AccordionSummary } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TxQueueCollapsed } from './TxQueueCollapsed'
import { NoPaddingAccordion } from './styled'
import { TxDetails } from './TxDetails'

type TxQueueRowProps = {
  isGrouped?: boolean
  transaction: Transaction
}

export const TxQueueRow = ({ isGrouped = false, transaction }: TxQueueRowProps): ReactElement => (
  <NoPaddingAccordion
    TransitionProps={{
      mountOnEnter: false,
      unmountOnExit: true,
      appear: true,
    }}
  >
    <AccordionSummary>
      <TxQueueCollapsed isGrouped={isGrouped} transaction={transaction} />
    </AccordionSummary>
    <AccordionDetails>
      <TxDetails transaction={transaction} />
    </AccordionDetails>
  </NoPaddingAccordion>
)
