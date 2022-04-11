import { ReactElement, useMemo } from 'react'
import { List } from '@material-ui/core'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Skeleton from '@material-ui/lab/Skeleton/Skeleton'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { sm } from 'src/theme/variables'
import { currentChainId } from 'src/logic/config/store/selectors'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { getChainById } from 'src/config'
import PendingTxListItem from 'src/components/Dashboard/PendingTxs/PendingTxListItem'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { pendingTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'

const SkeletonWrapper = styled.div`
  margin: ${sm} auto;
  border-radius: 8px;
  overflow: hidden;
`

const PendingTxsList = ({ size = 5 }: { size?: number }): ReactElement | null => {
  const { address } = useSelector(currentSafe)
  const chainId = useSelector(currentChainId)

  const queueTxns = useSelector(pendingTransactions)

  const queuedTxsToDisplay: Transaction[] = useMemo(() => {
    if (!queueTxns) return []

    return (
      Object.values(queueTxns.next)
        .concat(Object.values(queueTxns.queued))
        // take the first (i.e. newest) tx in a group of txns with the same nonce
        .map((group: Transaction[]) => group[0])
        .slice(0, size)
    )
  }, [queueTxns, size])

  if (!queueTxns) {
    return (
      <List component="div">
        {Array.from(Array(size).keys()).map((key) => (
          <SkeletonWrapper key={key}>
            <Skeleton variant="rect" height={52} />
          </SkeletonWrapper>
        ))}
      </List>
    )
  }

  if (!queuedTxsToDisplay?.length) {
    return <h3>This Safe has no queued transactions</h3>
  }

  const { shortName } = getChainById(chainId)
  const url = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, { safeAddress: address, shortName })
  return (
    <List component="div" disablePadding>
      {queuedTxsToDisplay?.map((transaction) => (
        <PendingTxListItem transaction={transaction} url={url} key={transaction.id} />
      ))}
    </List>
  )
}

export default PendingTxsList
