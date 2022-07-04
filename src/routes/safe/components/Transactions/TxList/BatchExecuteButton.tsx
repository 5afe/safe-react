import { ReactElement, useCallback, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Button from 'src/components/layout/Button'
import { Tooltip } from 'src/components/layout/Tooltip'
import { OnboardingTooltip } from 'src/components/OnboardingTooltip'
import { getBatchableTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { isTxPending } from 'src/logic/safe/store/selectors/pendingTransactions'
import { AppReduxState } from 'src/store'
import { md, sm } from 'src/theme/variables'
import styled from 'styled-components'
import { BatchExecuteHoverContext } from 'src/routes/safe/components/Transactions/TxList/BatchExecuteHoverProvider'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { useRouteMatch } from 'react-router-dom'
import { SAFE_ROUTES } from 'src/routes/routes'

interface BatchExecuteButtonProps {
  onClick: () => void
}

const HELP_STORAGE_KEY = 'batchExecutionButtonSeen'

export const BatchExecuteButton = ({ onClick }: BatchExecuteButtonProps): ReactElement => {
  const batchableTransactions = useSelector(getBatchableTransactions)
  const hoverContext = useContext(BatchExecuteHoverContext)
  const store = useSelector((state: AppReduxState) => state)
  const hasPendingTx = useMemo(
    () => batchableTransactions.some(({ id }) => isTxPending(store, id)),
    [batchableTransactions, store],
  )
  const isBatchable = batchableTransactions.length > 1
  const isDisabled = !isBatchable || hasPendingTx

  const handleOnMouseEnter = useCallback(() => {
    hoverContext.setActiveHover(batchableTransactions.map((tx) => tx.id))
  }, [batchableTransactions, hoverContext])

  const handleOnMouseLeave = useCallback(() => {
    hoverContext.setActiveHover()
  }, [hoverContext])

  const isSafeAppView = !!useSafeAppUrl().getAppUrl()
  const isSafeAppRoute = !!useRouteMatch(SAFE_ROUTES.APPS) && isSafeAppView

  return (
    <OnboardingTooltip
      defaultHidden={isSafeAppRoute}
      text="Confirmed transactions can be executed in batches"
      widgetLocalStorageId={HELP_STORAGE_KEY}
    >
      <ButtonWrapper>
        <Tooltip
          title={
            isDisabled
              ? 'Batch execution is only available for transactions that have been fully signed and are strictly sequential in Safe Nonce.'
              : 'All transactions highlighted in light green will be included in the batch execution.'
          }
          arrow
          placement="top-start"
        >
          <div>
            <Button
              color="primary"
              variant="contained"
              onClick={onClick}
              disabled={isDisabled}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            >
              Execute Batch{isBatchable && ` (${batchableTransactions.length})`}
            </Button>
          </div>
        </Tooltip>
      </ButtonWrapper>
    </OnboardingTooltip>
  )
}

const ButtonWrapper = styled.span`
  align-self: flex-end;
  margin-right: ${sm};
  margin-top: -51px;
  margin-bottom: ${md};
  z-index: 0;
`
