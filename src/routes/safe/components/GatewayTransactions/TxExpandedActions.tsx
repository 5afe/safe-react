import { Button } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useContext } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TxActions } from 'src/routes/safe/components/GatewayTransactions/QueueTransactions'

type TxExpandedActionsProps = {
  actions: { canCancel: boolean; canConfirm: boolean; canExecute: boolean }
  transaction: Transaction
}

export const TxExpandedActions = ({ actions, transaction }: TxExpandedActionsProps): ReactElement | null => {
  const { selectAction } = useContext(TxActions)
  const { canCancel, canConfirm, canExecute } = actions

  const handleConfirmButtonClick = () => {
    selectAction?.({ action: actions.canExecute ? 'execute' : 'confirm', transaction })
  }

  const handleCancelButtonClick = () => {
    selectAction?.({ action: 'cancel', transaction })
  }

  return (
    <>
      <Button
        size="md"
        color="primary"
        disabled={!canExecute && !canConfirm}
        onClick={handleConfirmButtonClick}
        className="primary"
      >
        {canExecute ? 'Execute' : 'Confirm'}
      </Button>
      {canCancel ? (
        <Button size="md" color="error" onClick={handleCancelButtonClick} className="error">
          Cancel
        </Button>
      ) : null}
    </>
  )
}
