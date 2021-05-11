import { Button, Tooltip } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { safeNonceSelector } from 'src/logic/safe/store/selectors'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useActionButtonsHandlers } from 'src/routes/safe/components/Transactions/TxList/hooks/useActionButtonsHandlers'

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
  const nonce = useSelector(safeNonceSelector)

  const onExecuteOrConfirm = (event) => {
    handleOnMouseLeave()
    handleConfirmButtonClick(event)
  }

  const getConfirmTooltipTitle = () => {
    if (transaction.txStatus === 'AWAITING_EXECUTION') {
      return transaction.executionInfo?.nonce === nonce
        ? 'Execute'
        : `Transaction with nonce ${nonce} needs to be executed first`
    }
    return 'Confirm'
  }

  // There is a problem in chrome that produces onMouseLeave event not being triggered properly.
  // https://github.com/facebook/react/issues/4492
  return (
    <>
      <Tooltip title={getConfirmTooltipTitle()} placement="top">
        <span>
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
        </span>
      </Tooltip>
      {canCancel && (
        <Button size="md" color="error" onClick={handleCancelButtonClick} className="error" disabled={isPending}>
          Reject
        </Button>
      )}
    </>
  )
}
