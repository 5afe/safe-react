import { AccordionDetails } from '@gnosis.pm/safe-react-components'
import { ReactElement, useContext, useEffect, useState } from 'react'

import { LocalTransactionStatus, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { NoPaddingAccordion, StyledAccordionSummary } from './styled'
import { TxDetails } from './TxDetails'
import { TxHoverContext } from './TxHoverProvider'
import { TxQueueCollapsed } from './TxQueueCollapsed'
import { useSelector } from 'react-redux'
import { AppReduxState } from 'src/store'
import { isTxPending, pendingTxByChain } from 'src/logic/safe/store/selectors/pendingTransactions'
import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'

type TxQueueRowProps = {
  isGrouped?: boolean
  transaction: Transaction
}

export const TxQueueRow = ({ isGrouped = false, transaction }: TxQueueRowProps): ReactElement => {
  const { activeHover } = useContext(TxHoverContext)
  const [tx, setTx] = useState<Transaction>(transaction)
  const willBeReplaced = tx.txStatus === LocalTransactionStatus.WILL_BE_REPLACED ? ' will-be-replaced' : ''
  const isPending = useSelector((state: AppReduxState) => isTxPending(state, transaction.id))
  const pendingTx = useSelector(pendingTxByChain)
  const pendingTxNonce = (pendingTx?.executionInfo as MultisigExecutionInfo)?.nonce
  const nonce = (transaction.executionInfo as MultisigExecutionInfo)?.nonce

  useEffect(() => {
    if ((activeHover && activeHover !== transaction.id) || (!isPending && nonce === pendingTxNonce)) {
      setTx((currTx) => ({ ...currTx, txStatus: LocalTransactionStatus.WILL_BE_REPLACED }))
      return
    }

    setTx(transaction)
  }, [activeHover, transaction, isPending, nonce, pendingTxNonce])

  return (
    <NoPaddingAccordion
      TransitionProps={{
        mountOnEnter: false,
        unmountOnExit: true,
        appear: true,
      }}
      className={willBeReplaced}
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
