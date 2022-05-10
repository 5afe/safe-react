import { Button, Tooltip } from '@gnosis.pm/safe-react-components'
import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { currentSafeNonce } from 'src/logic/safe/store/selectors'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useActionButtonsHandlers } from 'src/routes/safe/components/Transactions/TxList/hooks/useActionButtonsHandlers'
import useTxStatus from 'src/logic/hooks/useTxStatus'
import { isAwaitingExecution } from './utils'

type TxExpandedActionsProps = {
  transaction: Transaction
}

export const TxExpandedActions = ({ transaction }: TxExpandedActionsProps): ReactElement => {
  const {
    canCancel,
    handleConfirmButtonClick,
    handleCancelButtonClick,
    handleOnMouseEnter,
    handleOnMouseLeave,
    isPending,
    disabledActions,
  } = useActionButtonsHandlers(transaction)
  const nonce = useSelector(currentSafeNonce)
  const txStatus = useTxStatus(transaction)
  const isAwaitingEx = isAwaitingExecution(txStatus)

  const onExecuteOrConfirm = (event) => {
    handleOnMouseLeave()
    handleConfirmButtonClick(event)
  }

  const getConfirmTooltipTitle = () => {
    if (isAwaitingEx) {
      return (transaction.executionInfo as MultisigExecutionInfo)?.nonce === nonce
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
            {isAwaitingEx ? 'Execute' : 'Confirm'}
          </Button>
        </span>
      </Tooltip>
      {canCancel && (
        <Tooltip title="Reject" placement="top">
          <span>
            <Button size="md" color="error" onClick={handleCancelButtonClick} className="error" disabled={isPending}>
              Reject
            </Button>
          </span>
        </Tooltip>
      )}
    </>
  )
}
