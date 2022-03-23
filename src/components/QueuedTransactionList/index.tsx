import { Identicon, Text } from '@gnosis.pm/safe-react-components'
import {
  getTransactionQueue,
  Transaction,
  TransactionListItem,
  TransactionSummary,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { List } from '@material-ui/core'
import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { CircleDot } from 'src/components/AppLayout/Header/components/CircleDot'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getChainById } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { black300, grey400 } from 'src/theme/variables'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GATEWAY_URL } from 'src/utils/constants'

import styled from 'styled-components'

export const isTransactionType = (value: TransactionListItem): value is Transaction => {
  return value.type === 'TRANSACTION'
}

const ChevronRight = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.6951 7.54183C11.6909 7.53764 11.6365 7.48945 11.6323 7.48526L6.45371 2.30565C6.04617 1.89812 5.37986 1.89812 4.97232 2.30565C4.56478 2.71319 4.56478 3.3795 4.97232 3.78704L9.47095 8.28567L4.97232 12.7833C4.56478 13.1908 4.56478 13.8571 4.97232 14.2646C5.37986 14.6722 6.04617 14.6722 6.45371 14.2646L11.6427 9.0777C11.6469 9.07351 11.6909 9.03265 11.6951 9.02846C11.8994 8.82416 12.001 8.55492 12 8.28567C12.001 8.01538 11.8994 7.74613 11.6951 7.54183"
      fill={black300}
    />
  </svg>
)

const getTxsAwaitingYourSignatureByChainId = async (
  chainId: string,
  safeAddress: string,
  account: string,
): Promise<TransactionSummary[]> => {
  const { results } = await getTransactionQueue(GATEWAY_URL, chainId, checksumAddress(safeAddress))

  // If there are no queued transactions
  if (!results.length) return []

  const awaitingConfirmationTxs = results
    .filter(isTransactionType)
    .filter(
      (result) =>
        result.transaction.txStatus === 'AWAITING_CONFIRMATIONS' &&
        result.transaction.executionInfo?.type === 'MULTISIG' &&
        result.transaction.executionInfo.missingSigners?.some((addr) => addr.value === account),
    )
    .map(({ transaction }) => transaction)

  return awaitingConfirmationTxs
}

const TxsToConfirmList = (): ReactElement => {
  const ownedSafes = useOwnerSafes()
  const userAccount = useSelector(userAccountSelector)

  const [loading, setLoading] = useState<boolean>(true)
  const [txsAwaitingConfirmation, setTxsAwaitingConfirmation] = useState<Record<ChainId, TransactionSummary[]>>({})

  // Fetch txs awaiting confirmations after retrieving the owned safes from the LocalStorage
  useEffect(() => {
    if (!Object.keys(ownedSafes || {}).length) {
      return
    }
    const fetchAwaitingConfirmationTxs = async () => {
      const txs: Record<string, TransactionSummary[]> = {}

      for (const [chainId, safesPerChain] of Object.entries(ownedSafes)) {
        const arrayPromises: Array<Promise<TransactionSummary[]>> = []
        for (const safe of safesPerChain) {
          arrayPromises.push(getTxsAwaitingYourSignatureByChainId(chainId, safe, userAccount))
        }
        const txsByChain: TransactionSummary[] = await Promise.all(arrayPromises).then((values) => values.flat())

        // Include transactions per chain
        txs[chainId] = txsByChain
      }

      setTxsAwaitingConfirmation(txs)
      setLoading(false)
    }
    fetchAwaitingConfirmationTxs()
  }, [ownedSafes, userAccount])

  if (!userAccount) {
    return <h3>Connect a wallet</h3>
  }

  if (loading || Object.keys(txsAwaitingConfirmation).length === 0) {
    return <h3>Loading</h3>
  }

  return (
    <List component="div">
      {Object.entries(txsAwaitingConfirmation).map((chain) => {
        const [chainId, transactions] = chain
        const { shortName } = getChainById(chainId)
        if (!transactions.length) return null

        const aggregatedTxsBySafe: Record<string, number> = transactions.reduce((acc, val) => {
          // Retrieve safeHash from the transactionId
          const [, safeHash] = val.id.split('_')
          if (!acc[safeHash]) {
            return { ...acc, [safeHash]: 1 }
          }
          return { ...acc, [safeHash]: (acc[safeHash] += 1) }
        }, {})

        return Object.entries(aggregatedTxsBySafe).map((safeTxCount) => {
          const [safeHash, count] = safeTxCount
          return (
            <TransactionToConfirm key={`${safeHash}`} href={`/${shortName}:${safeHash}/transactions/queue`}>
              <OverlapDots>
                <CircleDot networkId={chainId} />
                <div style={{ width: '24px', height: '24px' }}>
                  <Identicon address={safeHash} size="sm" />
                </div>
              </OverlapDots>
              <PrefixedEthHashInfo textSize="lg" hash={safeHash} shortenHash={8} shortName={shortName} />
              <Text color="text" size="lg" as="span" strong>
                ({count})
              </Text>
              {ChevronRight}
            </TransactionToConfirm>
          )
        })
      })}
    </List>
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

const TransactionToConfirm = styled.a`
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
