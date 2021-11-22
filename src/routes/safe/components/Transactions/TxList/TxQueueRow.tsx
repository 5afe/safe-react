import { AccordionDetails } from '@gnosis.pm/safe-react-components'
import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, useContext, useEffect, useState } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useTransactionActions } from 'src/routes/safe/components/Transactions/TxList/hooks/useTransactionActions'
import { NoPaddingAccordion, StyledAccordionSummary } from './styled'
import { TxDetails } from './TxDetails'
import { TxHoverContext } from './TxHoverProvider'
import { TxQueueCollapsed } from './TxQueueCollapsed'

type TxQueueRowProps = {
  isGrouped?: boolean
  transaction: Transaction
}

export const TxQueueRow = ({ isGrouped = false, transaction }: TxQueueRowProps): ReactElement => {
  const { activeHover } = useContext(TxHoverContext)
  const actions = useTransactionActions(transaction)
  const [tx, setTx] = useState<Transaction>(transaction)

  useEffect(() => {
    if (activeHover && activeHover !== transaction.id) {
      setTx((currTx) => ({ ...currTx, txStatus: TransactionStatus.WILL_BE_REPLACED }))
      return
    }

    setTx(transaction)
  }, [activeHover, transaction])

  return (
    <NoPaddingAccordion
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
    >
      <StyledAccordionSummary>
        <TxQueueCollapsed isGrouped={isGrouped} transaction={tx} actions={actions} />
      </StyledAccordionSummary>
      <AccordionDetails>
        <TxDetails transaction={tx} actions={actions} />
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
