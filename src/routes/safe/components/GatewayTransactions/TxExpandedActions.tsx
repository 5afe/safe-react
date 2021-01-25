import { Button } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useContext } from 'react'

import { Transaction, TxLocation } from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionActionStateContext } from 'src/routes/safe/components/GatewayTransactions/TxActionProvider'

type TxExpandedActionsProps = {
  actions: { canCancel: boolean; canConfirm: boolean; canExecute: boolean }
  transaction: Transaction
  txLocation: TxLocation
}

export const TxExpandedActions = ({
  actions,
  transaction,
  txLocation,
}: TxExpandedActionsProps): ReactElement | null => {
  const { selectAction } = useContext(TransactionActionStateContext)
  const { canCancel, canConfirm, canExecute } = actions

  const handleConfirmButtonClick = () => {
    selectAction({
      actionSelected: actions.canExecute ? 'execute' : 'confirm',
      transactionId: transaction.id,
      txLocation,
    })
  }

  const handleCancelButtonClick = () => {
    selectAction({ actionSelected: 'cancel', transactionId: transaction.id, txLocation })
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
