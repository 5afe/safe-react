import { MouseEvent as ReactMouseEvent, useCallback, useContext, useMemo, useRef } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway'
import { useTransactionActions } from './useTransactionActions'
import { TransactionActionStateContext } from 'src/routes/safe/components/GatewayTransactions/TxActionProvider'
import { TxHoverContext } from 'src/routes/safe/components/GatewayTransactions/TxHoverProvider'
import { TxLocationContext } from 'src/routes/safe/components/GatewayTransactions/TxLocationProvider'

type ActionButtonsHandlers = {
  canCancel: boolean
  handleConfirmButtonClick: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  handleCancelButtonClick: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  handleOnMouseEnter: () => void
  handleOnMouseLeave: () => void
  isPending: boolean
  disabledActions: boolean
}

export const useActionButtonsHandlers = (transaction: Transaction): ActionButtonsHandlers => {
  const actionContext = useRef(useContext(TransactionActionStateContext))
  const hoverContext = useRef(useContext(TxHoverContext))
  const locationContext = useRef(useContext(TxLocationContext))
  const { canCancel, canConfirmThenExecute, canExecute } = useTransactionActions(transaction)

  const handleConfirmButtonClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation()
      actionContext.current.selectAction({
        actionSelected: canExecute || canConfirmThenExecute ? 'execute' : 'confirm',
        transactionId: transaction.id,
        txLocation: locationContext.current.txLocation,
      })
    },
    [canConfirmThenExecute, canExecute, transaction.id],
  )

  const handleCancelButtonClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation()
      actionContext.current.selectAction({
        actionSelected: 'cancel',
        transactionId: transaction.id,
        txLocation: locationContext.current.txLocation,
      })
    },
    [transaction.id],
  )

  const handleOnMouseEnter = useCallback(() => {
    if (canExecute) {
      hoverContext.current.setActiveHover(transaction.id)
    }
  }, [canExecute, transaction.id])

  const handleOnMouseLeave = useCallback(() => {
    hoverContext.current.setActiveHover()
  }, [])

  const isPending = useMemo(() => !!transaction.txStatus.match(/^PENDING.*/), [transaction.txStatus])

  const disabledActions = useMemo(
    () =>
      isPending ||
      (transaction.txStatus === 'AWAITING_EXECUTION' && locationContext.current.txLocation === 'queued.queued'),
    [isPending, transaction.txStatus],
  )

  return {
    canCancel,
    handleConfirmButtonClick,
    handleCancelButtonClick,
    handleOnMouseEnter,
    handleOnMouseLeave,
    isPending,
    disabledActions,
  }
}
