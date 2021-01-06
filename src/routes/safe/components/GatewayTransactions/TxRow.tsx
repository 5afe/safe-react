import { AccordionDetails, AccordionSummary } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { isCreationTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TxHistoryCollapsed } from 'src/routes/safe/components/GatewayTransactions/TxHistoryCollapsed'
import { NoPaddingAccordion } from './styled'
import { TxDetails } from './TxDetails'
import { TxInfoCreation } from './TxInfoCreation'

export const TxRow = ({ transaction }: { transaction: Transaction }): ReactElement => {
  return (
    <NoPaddingAccordion
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
    >
      <AccordionSummary>
        <TxHistoryCollapsed transaction={transaction} />
      </AccordionSummary>
      <AccordionDetails>
        {isCreationTxInfo(transaction.txInfo) ? (
          <TxInfoCreation transaction={transaction} />
        ) : (
          <TxDetails transactionId={transaction.id} />
        )}
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
