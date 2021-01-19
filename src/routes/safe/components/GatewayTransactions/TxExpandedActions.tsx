import { Button, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

type TxExpandedActionsProps = {
  actions: { canCancel: boolean; canConfirm: boolean; canExecute: boolean }
}

export const TxExpandedActions = ({ actions }: TxExpandedActionsProps): ReactElement | null => {
  const { canCancel, canConfirm, canExecute } = actions

  return (
    <>
      <Button size="md" disabled={!canExecute && !canConfirm}>
        <Text size="xl" color="white">
          {canExecute ? 'Execute' : 'Confirm'}
        </Text>
      </Button>
      {canCancel ? (
        <Button size="md" color="error">
          <Text size="xl" color="white">
            Cancel
          </Text>
        </Button>
      ) : null}
    </>
  )
}
