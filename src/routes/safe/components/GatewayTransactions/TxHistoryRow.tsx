import { AccordionDetails, AccordionSummary } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { isCreationTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useTransactionDetails } from './hooks/useTransactionDetails'
import { NoPaddingAccordion } from './styled'
import { TxHistoryCollapsed } from './TxHistoryCollapsed'
import { TxDetails } from './TxDetails'
import { TxInfoCreation } from './TxInfoCreation'

export const TxHistoryRow = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const { data, loading } = useTransactionDetails(transaction.id, 'history')

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
          <TxDetails data={data} loading={loading} />
        )}
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
