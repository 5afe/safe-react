import { AccordionDetails } from '@gnosis.pm/safe-react-components'
import { ReactElement, useContext, useEffect, useState } from 'react'

import {
  isMultisigExecutionInfo,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { NoPaddingAccordion, StyledAccordionSummary } from './styled'
import { TxDetails } from './TxDetails'
import { TxHoverContext } from './TxHoverProvider'
import { TxQueueCollapsed } from './TxQueueCollapsed'
import { useSelector } from 'react-redux'
import { AppReduxState } from 'src/store'
import { isTxPending, pendingTxByChain } from 'src/logic/safe/store/selectors/pendingTransactions'

type TxQueueRowProps = {
  isGrouped?: boolean
  transaction: Transaction
  onChildExpand?: (isExpanded: number) => void
}

export const TxQueueRow = ({ isGrouped = false, transaction, onChildExpand }: TxQueueRowProps): ReactElement => {
  const { activeHover } = useContext(TxHoverContext)
  const [tx, setTx] = useState<Transaction>(transaction)
  const willBeReplaced = tx.txStatus === LocalTransactionStatus.WILL_BE_REPLACED ? ' will-be-replaced' : ''
  const isPending = useSelector((state: AppReduxState) => isTxPending(state, transaction.id))
  const pendingTx = useSelector(pendingTxByChain)
  const pendingTxNonce = isMultisigExecutionInfo(pendingTx?.executionInfo) ? pendingTx?.executionInfo.nonce : undefined
  const nonce = isMultisigExecutionInfo(transaction.executionInfo) ? transaction.executionInfo.nonce : undefined
  const isReplacementTxPending = !isPending && nonce && pendingTxNonce && nonce === pendingTxNonce

  useEffect(() => {
    if ((activeHover && activeHover !== transaction.id) || isReplacementTxPending) {
      setTx((currTx) => ({ ...currTx, txStatus: LocalTransactionStatus.WILL_BE_REPLACED }))
      return
    }

    setTx(transaction)
  }, [activeHover, transaction, isReplacementTxPending])

  return (
    <NoPaddingAccordion
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
      className={willBeReplaced}
      onChange={(_, expanded) => onChildExpand?.(expanded ? 1 : -1)}
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
