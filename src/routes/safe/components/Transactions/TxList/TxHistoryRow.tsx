import { AccordionDetails } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { isCreationTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { NoPaddingAccordion, StyledAccordionSummary } from './styled'
import { TxHistoryCollapsed } from './TxHistoryCollapsed'
import { TxInfoCreation } from './TxInfoCreation'
import { getTxAccordionExpandedProp } from './utils'
import { TxDetails } from './TxDetails'

export const TxHistoryRow = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const shouldExpand = getTxAccordionExpandedProp()
  return (
    <NoPaddingAccordion
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
      expanded={shouldExpand}
    >
      <StyledAccordionSummary {...(shouldExpand && { expandIcon: null })}>
        <TxHistoryCollapsed transaction={transaction} />
      </StyledAccordionSummary>
      <AccordionDetails>
        {isCreationTxInfo(transaction.txInfo) ? (
          <TxInfoCreation transaction={transaction} />
        ) : (
          <TxDetails transaction={transaction} />
        )}
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
