import { ReactElement, useEffect, useState } from 'react'
import { Icon, Text } from '@gnosis.pm/safe-react-components'
import {
  getTransactionQueue,
  Transaction,
  TransactionListItem,
  TransactionSummary,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { List } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { Link } from 'react-router-dom'

import { isMultisigExecutionInfo, isTransactionSummary } from 'src/logic/safe/store/models/types/gateway.d'
import { grey400, sm, primary200 } from 'src/theme/variables'
import { CustomIconText } from 'src/components/CustomIconText'
import { getTxTo } from 'src/routes/safe/components/Transactions/TxList/utils'

import styled from 'styled-components'
import Spacer from 'src/components/Spacer'
import { useSelector } from 'react-redux'
import { GATEWAY_URL } from 'src/utils/constants'
import { currentChainId } from 'src/logic/config/store/selectors'
import { lastViewedSafe } from 'src/logic/currentSession/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { useTransactionType } from 'src/routes/safe/components/Transactions/TxList/hooks/useTransactionType'
import { useKnownAddress } from 'src/routes/safe/components/Transactions/TxList/hooks/useKnownAddress'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { getChainById } from 'src/config'
import { useAssetInfo } from 'src/routes/safe/components/Transactions/TxList/hooks/useAssetInfo'
import { TxInfo } from 'src/routes/safe/components/Transactions/TxList/TxCollapsed'

const MAX_TXS_DISPLAY = 5

const PendingTxsList = (): ReactElement => {
  const chainId = useSelector(currentChainId)
  const defaultSafe = useSelector(lastViewedSafe) || undefined

  const { isLoading: isLoadingOwnerSafes, ownerSafes } = useOwnerSafes()
  const [loadingOwnerSafes, setLoadingOwnerSafes] = useState<boolean>()

  // Selected Safe should come from the SideBar task when it's done
  const [selectedSafe, setSelectedSafe] = useState<string>()

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
    if (selectedSafe === undefined) return

    let isCurrent = true
    const fetchQueuedTxs = async () => {
      const { results } = await getTransactionQueue(GATEWAY_URL, chainId, checksumAddress(selectedSafe))
      const txs = results
        .filter((result) => isTransactionSummary(result))
        .slice(0, MAX_TXS_DISPLAY)
        .map((item: TransactionListItem) => (item as Transaction).transaction)
      if (isCurrent) {
        setQueuedTransactions(txs)
        setIsFetchingPendingTxs(false)
      }
    }
    setIsFetchingPendingTxs(true)
    fetchQueuedTxs()

    return () => {
      isCurrent = false
    }
  }, [chainId, selectedSafe])

  if (isFetchingPendingTxs) {
    return (
      <>
        {Array.from(Array(MAX_TXS_DISPLAY).keys()).map((_, idx) => (
          <TransactionSkeleton key={idx} />
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
        <PendingTx transaction={transaction} url={url} key={transaction.id} />
      ))}
    </List>
  )
}

type PendingTxType = {
  transaction: TransactionSummary
  url: string
}
const PendingTx = ({ transaction, url }: PendingTxType) => {
  const info = useAssetInfo(transaction.txInfo)
  const type = useTransactionType(transaction)
  const toAddress = getTxTo(transaction)
  const toInfo = useKnownAddress(toAddress)

  return (
    <TransactionToConfirm key={transaction.id} to={url}>
      <Text color="text" size="lg" as="span">
        {isMultisigExecutionInfo(transaction.executionInfo) && transaction.executionInfo.nonce}
      </Text>
      <CustomIconText
        address={toAddress?.value || '0x'}
        iconUrl={type.icon || toInfo?.logoUri || undefined}
        iconUrlFallback={type.fallbackIcon}
        text={type.text || toInfo?.name || undefined}
      />
      {info ? <TxInfo info={info} /> : <Spacer />}
      <TxConfirmations>
        {isMultisigExecutionInfo(transaction.executionInfo) ? (
          <StyledConfirmationsCount>
            <Icon type="check" size="md" color="primary" />
            {transaction.executionInfo.confirmationsSubmitted}
          </StyledConfirmationsCount>
        ) : (
          <Spacer />
        )}
        <ChevronRightIcon />
      </TxConfirmations>
    </TransactionToConfirm>
  )
}

export default PendingTxsList

const StyledConfirmationsCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  background-color: ${primary200};
  padding: 8px 6px;
`

const TransactionSkeleton = styled.div`
  min-width: 270px;
  height: 40px;
  background-color: ${grey400};
  border-radius: 8px;
  margin: ${sm} auto;
`

const TransactionToConfirm = styled(Link)`
  min-width: 270px;
  height: 40px;
  display: grid;
  align-items: center;
  grid-template-columns: 25px 3fr 2fr 1.5fr;
  gap: 4px;
  margin: ${sm} auto;
  padding: 4px 8px;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${grey400};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
`

const TxConfirmations = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
  margin-left: auto;
`
