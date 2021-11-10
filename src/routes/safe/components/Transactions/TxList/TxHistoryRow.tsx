import { AccordionDetails } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { isCreationTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { NoPaddingAccordion, StyledAccordionSummary } from './styled'
import { TxHistoryCollapsed } from './TxHistoryCollapsed'
import { TxInfoCreation } from './TxInfoCreation'
import { shouldExpandTxAccordion } from './utils'
import { TxStoreDetails } from './TxStoreDetails'

export const TxHistoryRow = ({ transaction }: { transaction: Transaction }): ReactElement => (
  <NoPaddingAccordion
    TransitionProps={{
      mountOnEnter: false,
      unmountOnExit: true,
      appear: true,
    }}
    expanded={shouldExpandTxAccordion()}
  >
    <StyledAccordionSummary>
      <TxHistoryCollapsed transaction={transaction} />
    </StyledAccordionSummary>
    <AccordionDetails>
      {isCreationTxInfo(transaction.txInfo) ? (
        <TxInfoCreation transaction={transaction} />
      ) : (
        <TxStoreDetails transaction={transaction} />
      )}
    </AccordionDetails>
  </NoPaddingAccordion>
)
