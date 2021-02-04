import { Button } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useActionButtonsHandlers } from 'src/routes/safe/components/GatewayTransactions/hooks/useActionButtonsHandlers'

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

  return (
    <>
      <Button
        size="md"
        color="primary"
        disabled={disabledActions}
        onClick={handleConfirmButtonClick}
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
