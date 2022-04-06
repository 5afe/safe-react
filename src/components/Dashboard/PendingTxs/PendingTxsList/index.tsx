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
import { useQueueTransactions } from 'src/routes/safe/components/Transactions/TxList/hooks/useQueueTransactions'

const SkeletonWrapper = styled.div`
  margin: ${sm} auto;
  border-radius: 8px;
  overflow: hidden;
`

const PendingTxsList = ({ size = 5 }: { size?: number }): ReactElement | null => {
  const { address } = useSelector(currentSafe)
  const chainId = useSelector(currentChainId)

  const queue = useQueueTransactions()

  const queuedTxsToDisplay: Transaction[] = useMemo(() => {
    let txs: Transaction[] = []

    if (!queue) {
      return txs
    }

    nonceLoop: for (const { transactions } of Object.values(queue)) {
      for (const [, transactionsByNonce] of transactions) {
        // Add same nonced transactions to list
        txs = txs.concat(transactionsByNonce)

        // If adding same nonced transactions exceeded/reached limit, cleanup and break
        if (txs.length >= size) {
          if (txs.length > size) {
            txs = txs.slice(0, size)
          }
          break nonceLoop
        }
      }
    }

    return txs
  }, [queue, size])

  if (!queue) {
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
    <List component="div">
      {queuedTxsToDisplay?.map((transaction) => (
        <PendingTxListItem transaction={transaction} url={url} key={transaction.id} />
      ))}
    </List>
  )
}

export default PendingTxsList
