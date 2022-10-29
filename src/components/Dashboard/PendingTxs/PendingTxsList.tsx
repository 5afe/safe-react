import { ReactElement, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Skeleton from '@material-ui/lab/Skeleton/Skeleton'
import { Text } from '@gnosis.pm/safe-react-components'
import { Box } from '@material-ui/core'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { currentChainId } from 'src/logic/config/store/selectors'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { getChainById } from 'src/config'
import PendingTxListItem from 'src/components/Dashboard/PendingTxs/PendingTxListItem'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { pendingTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { Card, WidgetBody, WidgetContainer, WidgetTitle, ViewAllLink } from 'src/components/Dashboard/styled'
import NoTransactionsImage from 'src/routes/safe/components/Transactions/TxList/assets/no-transactions.svg'
import Img from 'src/components/layout/Img'

const SkeletonWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
`

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`

const StyledWidgetTitle = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledText = styled(Text)`
  color: #06fc99;
`

const EmptyState = (
  <Card>
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" height={1} gridGap="16px">
      <Img alt="No Transactions yet" src={NoTransactionsImage} />
      <StyledText size="xl">This Safe has no queued transactions</StyledText>
    </Box>
  </Card>
)

const PendingTxsList = ({ size = 5 }: { size?: number }): ReactElement | null => {
  const { address, loaded } = useSelector(currentSafe)
  const chainId = useSelector(currentChainId)
  const queueTxns = useSelector(pendingTransactions)
  const { shortName } = getChainById(chainId)
  const url = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, { safeAddress: address, shortName })
  const [totalQueuedTxs, setTotalQueuedTxs] = useState<number>()

  const queuedTxsToDisplay: Transaction[] = useMemo(() => {
    if (!queueTxns) return []

    const allQueuedTransactions = Object.values(queueTxns.next).concat(Object.values(queueTxns.queued))
    setTotalQueuedTxs(allQueuedTransactions.length)

    return (
      allQueuedTransactions
        // take the most recent tx in a group of txns with the same nonce
        .map((group: Transaction[]) => group.reduce((acc, tx) => (tx.timestamp > acc.timestamp ? tx : acc), group[0]))
        .slice(0, size)
    )
  }, [queueTxns, size])

  const LoadingState = useMemo(
    () => (
      <StyledList>
        {Array.from(Array(size).keys()).map((key) => (
          <SkeletonWrapper key={key}>
            <Skeleton variant="rect" height={52} />
          </SkeletonWrapper>
        ))}
      </StyledList>
    ),
    [size],
  )

  const ResultState = useMemo(
    () => (
      <StyledList>
        {queuedTxsToDisplay.map((transaction) => (
          <PendingTxListItem transaction={transaction} url={url} key={transaction.id} />
        ))}
      </StyledList>
    ),
    [queuedTxsToDisplay, url],
  )

  const getWidgetBody = () => {
    if (!loaded) return LoadingState
    if (!queuedTxsToDisplay.length) return EmptyState
    return ResultState
  }

  return (
    <WidgetContainer>
      <StyledWidgetTitle>
        <WidgetTitle>Transaction Queue {totalQueuedTxs ? ` (${totalQueuedTxs})` : ''}</WidgetTitle>
        <ViewAllLink url={url} />
      </StyledWidgetTitle>
      <WidgetBody>{getWidgetBody()}</WidgetBody>
    </WidgetContainer>
  )
}

export default PendingTxsList
