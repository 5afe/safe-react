import { ReactElement, useEffect, useState } from 'react'
import { getTransactionQueue, TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'
import { List } from '@material-ui/core'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { isTransactionSummary } from 'src/logic/safe/store/models/types/gateway.d'
import { grey400, sm } from 'src/theme/variables'
import { GATEWAY_URL } from 'src/utils/constants'
import { currentChainId } from 'src/logic/config/store/selectors'
import { lastViewedSafe } from 'src/logic/currentSession/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { getChainById } from 'src/config'
import PendingTxListItem from 'src/components/Dashboard/PendingTxListItem'

const TransactionSkeleton = styled.div`
  min-width: 270px;
  height: 40px;
  background-color: ${grey400};
  border-radius: 8px;
  margin: ${sm} auto;
`

const MAX_TXS_DISPLAY = 5

const PendingTxsList = (): ReactElement => {
  const chainId = useSelector(currentChainId)
  const defaultSafe = useSelector(lastViewedSafe)

  const { isLoading: isLoadingOwnerSafes, ownerSafes } = useOwnerSafes()
  const [loadingOwnerSafes, setLoadingOwnerSafes] = useState<boolean>()

  // Selected Safe should come from the SideBar task when it's done
  const [selectedSafe, setSelectedSafe] = useState<string | null>()

  const [isFetchingPendingTxs, setIsFetchingPendingTxs] = useState<boolean>()
  const [queuedTransactions, setQueuedTransactions] = useState<TransactionSummary[]>([])

  useEffect(() => {
    if (isLoadingOwnerSafes === undefined) return

    if (ownerSafes[chainId]?.length) {
      setSelectedSafe(ownerSafes[chainId][0])
    } else {
      setSelectedSafe(defaultSafe)
    }
    setLoadingOwnerSafes(false)
  }, [chainId, defaultSafe, isLoadingOwnerSafes, ownerSafes, selectedSafe])

  // Fetch txs awaiting confirmations
  useEffect(() => {
    if (!selectedSafe) return

    let isCurrent = true
    const fetchQueuedTxs = async () => {
      setIsFetchingPendingTxs(true)
      const { results } = await getTransactionQueue(GATEWAY_URL, chainId, checksumAddress(selectedSafe))
      const txs = results
        .filter(isTransactionSummary)
        .slice(0, MAX_TXS_DISPLAY)
        .map((item) => item.transaction)
      if (isCurrent) {
        setQueuedTransactions(txs)
        setIsFetchingPendingTxs(false)
      }
    }
    fetchQueuedTxs()

    return () => {
      isCurrent = false
    }
  }, [chainId, selectedSafe])

  if (isFetchingPendingTxs) {
    return (
      <>
        {Array.from(Array(MAX_TXS_DISPLAY).keys()).map((key) => (
          <TransactionSkeleton key={key} />
        ))}
      </>
    )
  }

  if (selectedSafe && !queuedTransactions.length && isFetchingPendingTxs === false) {
    return <h3>This Safe has no pending transactions</h3>
  }

  if (!loadingOwnerSafes && !selectedSafe) {
    return <h3>No Safes to display</h3>
  }

  if (!selectedSafe) return <></>

  const { shortName } = getChainById(chainId)
  const url = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, { safeAddress: selectedSafe, shortName })
  return (
    <List component="div">
      {queuedTransactions.map((transaction) => (
        <PendingTxListItem transaction={transaction} url={url} key={transaction.id} />
      ))}
    </List>
  )
}

export default PendingTxsList
