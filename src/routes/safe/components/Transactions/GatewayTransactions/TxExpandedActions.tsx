import { Button } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useActionButtonsHandlers } from 'src/routes/safe/components/Transactions/GatewayTransactions/hooks/useActionButtonsHandlers'

type TxExpandedActionsProps = {
  transaction: Transaction
}

export const TxExpandedActions = ({ transaction }: TxExpandedActionsProps): ReactElement | null => {
  const {
    canCancel,
    handleConfirmButtonClick,
    handleCancelButtonClick,
    handleOnMouseEnter,
    handleOnMouseLeave,
    isPending,
    disabledActions,
  } = useActionButtonsHandlers(transaction)

  const onExecuteOrConfirm = (event) => {
    handleOnMouseLeave()
    handleConfirmButtonClick(event)
  }

  // There is a problem in chrome that produces onMouseLeave event not being triggered properly.
  // https://github.com/facebook/react/issues/4492
  return (
    <>
      <Button
        size="md"
        color="primary"
        disabled={disabledActions}
        onClick={onExecuteOrConfirm}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="primary"
      >
        {transaction.txStatus === 'AWAITING_EXECUTION' ? 'Execute' : 'Confirm'}
      </Button>
      {canCancel && (
        <Button size="md" color="error" onClick={handleCancelButtonClick} className="error" disabled={isPending}>
          Cancel
        </Button>
      )}
    </>
  )
}
