import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { MouseEvent as ReactMouseEvent, useCallback, useContext, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  isMultiSigExecutionDetails,
  isStatusAwaitingConfirmation,
  isStatusAwaitingExecution,
  isTxPending,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { addressInList } from 'src/routes/safe/components/Transactions/TxList/utils'
import { useTransactionActions } from './useTransactionActions'
import { TransactionActionStateContext } from 'src/routes/safe/components/Transactions/TxList/TxActionProvider'
import { TxHoverContext } from 'src/routes/safe/components/Transactions/TxList/TxHoverProvider'
import { TxLocationContext } from 'src/routes/safe/components/Transactions/TxList/TxLocationProvider'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { NOTIFICATIONS } from 'src/logic/notifications'

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
  const currentUser = useSelector(userAccountSelector)
  const actionContext = useRef(useContext(TransactionActionStateContext))
  const hoverContext = useRef(useContext(TxHoverContext))
  const locationContext = useRef(useContext(TxLocationContext))
  const dispatch = useDispatch()
  const { canCancel, canConfirmThenExecute, canExecute } = useTransactionActions(transaction)

  const handleConfirmButtonClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation()
      if (transaction.txDetails && isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)) {
        const details = transaction.txDetails.detailedExecutionInfo
        if (
          (canExecute && details.confirmationsRequired > details.confirmations.length) ||
          (canConfirmThenExecute && details.confirmationsRequired - 1 > details.confirmations.length)
        ) {
          dispatch(enqueueSnackbar(NOTIFICATIONS.TX_FETCH_SIGNATURES_ERROR_MSG))
          return
        }
      }
      actionContext.current.selectAction({
        actionSelected: canExecute || canConfirmThenExecute ? 'execute' : 'confirm',
        transactionId: transaction.id,
      })
    },
    [canConfirmThenExecute, canExecute, dispatch, transaction.id, transaction.txDetails],
  )

  const handleCancelButtonClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation()
      actionContext.current.selectAction({
        actionSelected: 'cancel',
        transactionId: transaction.id,
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

  const isPending = useMemo(() => isTxPending(transaction.txStatus), [transaction.txStatus])

  const signaturePending = addressInList(
    (transaction.executionInfo as MultisigExecutionInfo)?.missingSigners ?? undefined,
  )

  const disabledActions = useMemo(
    () =>
      !currentUser ||
      isPending ||
      (isStatusAwaitingExecution(transaction.txStatus) && locationContext.current.txLocation === 'queued.queued') ||
      (isStatusAwaitingConfirmation(transaction.txStatus) && !signaturePending(currentUser)),
    [currentUser, isPending, signaturePending, transaction.txStatus],
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
