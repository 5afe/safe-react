import { AccordionDetails } from '@gnosis.pm/safe-react-components'
import { ReactElement, useContext, useEffect, useState } from 'react'

import { LocalTransactionStatus, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
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
  const [tx, setTx] = useState<Transaction>(transaction)

  useEffect(() => {
    if (activeHover && activeHover !== transaction.id) {
      setTx((currTx) => ({ ...currTx, txStatus: LocalTransactionStatus.WILL_BE_REPLACED }))
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
        <TxQueueCollapsed isGrouped={isGrouped} transaction={tx} />
      </StyledAccordionSummary>
      <AccordionDetails>
        <TxDetails transaction={tx} />
      </AccordionDetails>
    </NoPaddingAccordion>
  )
}
