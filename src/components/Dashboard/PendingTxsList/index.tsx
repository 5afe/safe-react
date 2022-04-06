import { ReactElement } from 'react'
import { List } from '@material-ui/core'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { sm } from 'src/theme/variables'
import { currentChainId } from 'src/logic/config/store/selectors'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { getChainById } from 'src/config'
import PendingTxListItem from 'src/components/Dashboard/PendingTxListItem'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { MAX_TXS_DISPLAY } from 'src/routes/Home'
import Skeleton from '@material-ui/lab/Skeleton/Skeleton'

const SkeletonWrapper = styled.div`
  margin: ${sm} auto;
  border-radius: 8px;
  overflow: hidden;
`

const PendingTxsList = ({ transactions }: { transactions?: Transaction[] }): ReactElement => {
  const { address } = useSelector(currentSafe)
  const chainId = useSelector(currentChainId)

  if (!transactions) {
    return (
      <List component="div">
        {Array.from(Array(MAX_TXS_DISPLAY).keys()).map((key) => (
          <SkeletonWrapper key={key}>
            <Skeleton variant="rect" height={52} />
          </SkeletonWrapper>
        ))}
      </List>
    )
  }

  if (!transactions?.length) {
    return <h3>This Safe has no pending transactions</h3>
  }

  const { shortName } = getChainById(chainId)
  const url = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, { safeAddress: address, shortName })
  return (
    <List component="div">
      {transactions?.map((transaction) => (
        <PendingTxListItem transaction={transaction} url={url} key={transaction.id} />
      ))}
    </List>
  )
}

export default PendingTxsList
