import { ReactElement, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Skeleton from '@material-ui/lab/Skeleton/Skeleton'
import { Link } from 'react-router-dom'
import { Text } from '@gnosis.pm/safe-react-components'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { currentChainId } from 'src/logic/config/store/selectors'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { getChainById } from 'src/config'
import PendingTxListItem from 'src/components/Dashboard/PendingTxs/PendingTxListItem'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { pendingTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { Card, WidgetBody, WidgetContainer, WidgetTitle } from 'src/components/Dashboard/styled'
import { md, sm } from 'src/theme/variables'

const SkeletonWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
`

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

const StyledWidgetTitle = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: ${sm};
  margin-bottom: 10px;
  padding-right: ${md};
`

const EmptyState = (
  <Card>
    <Text size="xl">This Safe has no queued transactions</Text>
  </Card>
)

const PendingTxsList = ({ size = 5 }: { size?: number }): ReactElement | null => {
  const { address } = useSelector(currentSafe)
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
        // take the first (i.e. newest) tx in a group of txns with the same nonce
        .map((group: Transaction[]) => group[0])
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
        {queuedTxsToDisplay?.map((transaction) => (
          <PendingTxListItem transaction={transaction} url={url} key={transaction.id} />
        ))}
      </StyledList>
    ),
    [queuedTxsToDisplay, url],
  )

  const getWidgetBody = () => {
    if (!queueTxns) return LoadingState
    if (!queuedTxsToDisplay?.length) return EmptyState
    return ResultState
  }

  return (
    <WidgetContainer>
      <StyledWidgetTitle>
        <WidgetTitle>Transactions to Sign{totalQueuedTxs ? ` (${totalQueuedTxs})` : ''}</WidgetTitle>
        <StyledLink to={url}>
          View All
          <ChevronRightIcon />
        </StyledLink>
      </StyledWidgetTitle>
      <WidgetBody>{getWidgetBody()}</WidgetBody>
    </WidgetContainer>
  )
}

export default PendingTxsList
