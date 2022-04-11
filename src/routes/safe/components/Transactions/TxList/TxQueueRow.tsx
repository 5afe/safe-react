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
import { isTxPending, pendingTxsByChain } from 'src/logic/safe/store/selectors/pendingTransactions'
import { BatchExecuteHoverContext } from 'src/routes/safe/components/Transactions/TxList/BatchExecuteHoverProvider'

type TxQueueRowProps = {
  isGrouped?: boolean
  transaction: Transaction
  onChildExpand?: (isExpanded: number) => void
}

export const TxQueueRow = ({ isGrouped = false, transaction, onChildExpand }: TxQueueRowProps): ReactElement => {
  const { activeHover } = useContext(TxHoverContext)
  const { activeHover: batchTxActiveHover } = useContext(BatchExecuteHoverContext)
  const [tx, setTx] = useState<Transaction>(transaction)
  const willBeReplaced = tx.txStatus === LocalTransactionStatus.WILL_BE_REPLACED ? ' will-be-replaced' : ''
  const inBatch = batchTxActiveHover?.includes(transaction.id) ? ' highlight' : ''
  const isThisTxPending = useSelector((state: AppReduxState) => isTxPending(state, transaction.id))
  const pendingTxs = useSelector(pendingTxsByChain)
  const isReplacementTxPending = pendingTxs?.some(
    (pendingTx) =>
      isMultisigExecutionInfo(pendingTx.executionInfo) &&
      isMultisigExecutionInfo(transaction.executionInfo) &&
      pendingTx.executionInfo.nonce === transaction.executionInfo.nonce,
  )

  useEffect(() => {
    if ((activeHover && activeHover !== transaction.id) || (!isThisTxPending && isReplacementTxPending)) {
      setTx((currTx) => ({ ...currTx, txStatus: LocalTransactionStatus.WILL_BE_REPLACED }))
      return
    }

    setTx(transaction)
  }, [activeHover, transaction, isReplacementTxPending, isThisTxPending])

  return (
    <NoPaddingAccordion
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
      className={willBeReplaced + inBatch}
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
