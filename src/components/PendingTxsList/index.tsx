import { Identicon } from '@gnosis.pm/safe-react-components'
import { getTransactionQueue, TransactionSummary, TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'
import { List } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { ReactElement, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { CircleDot } from 'src/components/AppLayout/Header/components/CircleDot'
import { getChainById } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import useLocalSafes from 'src/logic/safe/hooks/useLocalSafes'
import {
  isMultisigExecutionInfo,
  isTransactionSummary,
  isTransferTxInfo,
  LocalTransactionStatus,
} from 'src/logic/safe/store/models/types/gateway.d'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { grey400 } from 'src/theme/variables'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GATEWAY_URL } from 'src/utils/constants'
import { CustomIconText } from 'src/components/CustomIconText'
import { getAssetInfo } from 'src/routes/safe/components/Transactions/TxList/utils'
import { TxInfo } from 'src/routes/safe/components/Transactions/TxList/TxCollapsed'

import OutgoingTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/outgoing.svg'
import SettingsTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/settings.svg'

import styled from 'styled-components'
import Spacer from 'src/components/Spacer'

const getTxsAwaitingConfirmationByChainId = async (
  chainId: string,
  safeAddress: string,
): Promise<TransactionSummary[]> => {
  const { results } = await getTransactionQueue(GATEWAY_URL, chainId, checksumAddress(safeAddress))
  return results.reduce((acc, cur) => {
    if (
      isTransactionSummary(cur) &&
      isMultisigExecutionInfo(cur.transaction.executionInfo) &&
      cur.transaction.txStatus === LocalTransactionStatus.AWAITING_CONFIRMATIONS
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

const PendingTxsList = (): ReactElement => {
  const localSafesWithDetails = useLocalSafes()
  const localSafes: Record<string, string[]> = Object.entries(localSafesWithDetails).reduce(
    (result, [chain, safes]) => {
      const safesAddr = safes.map((safe) => safe.address)
      return { ...result, [chain]: safesAddr }
    },
    {},
  )

  const [txsAwaitingConfirmation, setTxsAwaitingConfirmation] = useState<TransactionsSummaryPerChain>({})
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)

  const title = <h2>Transactions to Sign</h2>

  // Fetch txs awaiting confirmations after retrieving the owned safes from the LocalStorage
  useEffect(() => {
    if (!isInitialLoad || !Object.keys(localSafes || {}).length) {
      return
    }

    const fetchAwaitingConfirmationTxs = async () => {
      const txs: TransactionsSummaryPerChain = {}

      // todo: remove the slice
      for (const [chainId, safesPerChain] of Object.entries(localSafes).slice(1, 3)) {
        txs[chainId] = {}
        const arrayPromises = safesPerChain.map((safeAddr) => {
          return getTxsAwaitingConfirmationByChainId(chainId, safeAddr)
        })
        const pendingTxs = await Promise.all(arrayPromises)

        pendingTxs.forEach((summaries, i) => {
          if (!summaries.length) return // filter out the safes without pending transactions
          const safeAddress = safesPerChain[i]
          txs[chainId][safeAddress] = summaries
        })
      }
      setTxsAwaitingConfirmation(txs)
      setIsInitialLoad(false)
    }
    fetchAwaitingConfirmationTxs()
  }, [localSafes, isInitialLoad])

  if (isInitialLoad) {
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
      <List component="div">
        {Object.entries(txsAwaitingConfirmation)?.map(([chainId, transactionsPerSafe]) => {
          const { shortName } = getChainById(chainId)
          return Object.entries(transactionsPerSafe).map(([safeAddress, transactions]) => {
            if (!transactions.length) return null
            const url = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, { safeAddress, shortName })

            return transactions.map((transaction) => {
              const info = getAssetInfo(transaction.txInfo)

              return (
                <TransactionToConfirm key={transaction.id} to={url}>
                  <OverlapDots>
                    <CircleDot networkId={chainId} />
                    <div style={{ width: '24px', height: '24px' }}>
                      <Identicon address={safeAddress} size="sm" />
                    </div>
                  </OverlapDots>
                  <CustomIconText
                    address="0x"
                    iconUrl={
                      isTransferTxInfo(transaction.txInfo) &&
                      transaction.txInfo.direction === TransferDirection.OUTGOING
                        ? OutgoingTxIcon
                        : SettingsTxIcon || undefined
                    }
                  />
                  {info ? <TxInfo info={info} /> : <Spacer />}
                  <ChevronRightIcon />
                </TransactionToConfirm>
              )
            })
          })
        })}
      </List>
    </>
  )
}

export default PendingTxsList

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
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 4fr 1fr;
  gap: 4px;
  margin: 16px auto;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${grey400};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  padding: 4px;
`
