import { Identicon, Switch, Text } from '@gnosis.pm/safe-react-components'
import { getTransactionQueue, TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'
import { FormControlLabel, List } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { CircleDot } from 'src/components/AppLayout/Header/components/CircleDot'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getChainById } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import useLocalSafes from 'src/logic/safe/hooks/useLocalSafes'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import {
  isMultisigExecutionInfo,
  isTransactionSummary,
  LocalTransactionStatus,
} from 'src/logic/safe/store/models/types/gateway.d'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { grey400 } from 'src/theme/variables'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GATEWAY_URL } from 'src/utils/constants'

import styled from 'styled-components'

const getTxsAwaitingConfirmationByChainId = async (
  chainId: string,
  safeAddress: string,
  account: string,
  ownedSafes = false,
): Promise<TransactionSummary[]> => {
  const { results } = await getTransactionQueue(GATEWAY_URL, chainId, checksumAddress(safeAddress))
  return results.reduce((acc, cur) => {
    if (
      isTransactionSummary(cur) &&
      isMultisigExecutionInfo(cur.transaction.executionInfo) &&
      cur.transaction.txStatus === LocalTransactionStatus.AWAITING_CONFIRMATIONS &&
      (ownedSafes ? cur.transaction.executionInfo.missingSigners?.some(({ value }) => value === account) : true)
    ) {
      return [...acc, cur.transaction]
    }
    return acc
  }, [])
}

type TransactionsSummaryPerChain = {
  [chainId: ChainId]: {
    [safeAddress: string]: TransactionSummary[]
  }
}

const TxsToConfirmList = (): ReactElement => {
  const ownedSafes: Record<string, string[]> = useOwnerSafes()
  const localSafesWithDetails = useLocalSafes()
  const localSafes: Record<string, string[]> = Object.entries(localSafesWithDetails).reduce(
    (result, [chain, safes]) => {
      const safesAddr = safes.map((safe) => safe.address)
      return { ...result, [chain]: safesAddr }
    },
    {},
  )
  const userAccount = useSelector(userAccountSelector)

  const [loading, setLoading] = useState<boolean>(true)
  const [txsAwaitingConfirmation, setTxsAwaitingConfirmation] = useState<TransactionsSummaryPerChain>({})
  const [displayOwnedSafes, setDisplayOwnedSafes] = useState<boolean>(false)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)

  const canDisplayOwnedSafes = displayOwnedSafes && userAccount
  const safesToTraverse = canDisplayOwnedSafes ? ownedSafes : localSafes

  const title = <h2>Transactions to Sign</h2>

  const handleToggleOwnedSafes = () => {
    if (userAccount) {
      setDisplayOwnedSafes((val) => !val)
      setTxsAwaitingConfirmation({})
      setIsInitialLoad(true)
    }
  }

  // Fetch txs awaiting confirmations after retrieving the owned safes from the LocalStorage
  useEffect(() => {
    if (!isInitialLoad || !Object.keys(safesToTraverse || {}).length) {
      return
    }
    const fetchAwaitingConfirmationTxs = async () => {
      const txs: TransactionsSummaryPerChain = {}

      for (const [chainId, safesPerChain] of Object.entries(safesToTraverse).slice(0, 3)) {
        txs[chainId] = {}
        const arrayPromises = safesPerChain.map((safeAddr) => {
          return getTxsAwaitingConfirmationByChainId(chainId, safeAddr, userAccount, displayOwnedSafes)
        })
        const txsByChain = await Promise.all(arrayPromises)

        txsByChain.forEach((summaries, i) => {
          const safeAddress = safesPerChain[i]
          txs[chainId][safeAddress] = summaries
        })
      }
      setTxsAwaitingConfirmation(txs)
      setLoading(false)
      setIsInitialLoad(false)
    }
    fetchAwaitingConfirmationTxs()
  }, [displayOwnedSafes, userAccount, safesToTraverse])

  if (loading || isInitialLoad) {
    return (
      <>
        {title}
        <h3>Loading</h3>
      </>
    )
  }

  if (Object.keys(txsAwaitingConfirmation).length === 0) {
    return (
      <>
        {title}
        <h3>No Transactions</h3>
      </>
    )
  }
  return (
    <>
      {title}
      <FormControlLabel
        control={<Switch checked={displayOwnedSafes} onChange={handleToggleOwnedSafes} />}
        label="Only Owned Safes"
      />
      <List component="div">
        {Object.entries(txsAwaitingConfirmation)?.map(([chainId, transactionsPerSafe]) => {
          const { shortName } = getChainById(chainId)
          return Object.entries(transactionsPerSafe).map(([safeAddress, transactions]) => {
            if (!transactions.length) return null

            const url = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, { safeAddress, shortName })
            return (
              <TransactionToConfirm key={safeAddress} to={url}>
                <OverlapDots>
                  <CircleDot networkId={chainId} />
                  <div style={{ width: '24px', height: '24px' }}>
                    <Identicon address={safeAddress} size="sm" />
                  </div>
                </OverlapDots>
                <PrefixedEthHashInfo textSize="lg" hash={safeAddress} shortenHash={8} shortName={shortName} />
                <Text color="text" size="lg" as="span" strong>
                  ({transactions.length})
                </Text>
                <ChevronRightIcon />
              </TransactionToConfirm>
            )
          })
        })}
      </List>
    </>
  )
}

export default TxsToConfirmList

const OverlapDots = styled.div`
  height: 24px;
  width: 20px;
  position: relative;

  & > div {
    position: absolute;
    top: 4px;
  }
`

const TransactionToConfirm = styled(Link)`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin: 16px auto;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${grey400};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  padding: 4px;
`
