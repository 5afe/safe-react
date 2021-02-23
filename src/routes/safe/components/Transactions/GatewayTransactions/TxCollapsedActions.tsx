import { Icon, Tooltip } from '@gnosis.pm/safe-react-components'
import { default as MuiIconButton } from '@material-ui/core/IconButton'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useActionButtonsHandlers } from './hooks/useActionButtonsHandlers'

const IconButton = styled(MuiIconButton)`
  padding: 8px !important;

  &.Mui-disabled {
    opacity: 0.4;
  }
`

type TxCollapsedActionsProps = {
  transaction: Transaction
}

export const TxCollapsedActions = ({ transaction }: TxCollapsedActionsProps): ReactElement => {
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
      <Tooltip title={transaction.txStatus === 'AWAITING_EXECUTION' ? 'Execute' : 'Confirm'} placement="top">
        <IconButton
          size="small"
          type="button"
          onClick={handleConfirmButtonClick}
          disabled={disabledActions}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        >
          <Icon type={transaction.txStatus === 'AWAITING_EXECUTION' ? 'rocket' : 'check'} color="primary" size="sm" />
        </IconButton>
      </Tooltip>
      {canCancel && (
        <Tooltip title="Cancel" placement="top">
          <IconButton size="small" type="button" onClick={handleCancelButtonClick} disabled={isPending}>
            <Icon type="circleCross" color="error" size="sm" />
          </IconButton>
        </Tooltip>
      )}
    </>
  )
}
