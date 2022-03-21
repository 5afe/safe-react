import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getTransactionQueue, Transaction, TransactionListItem } from '@gnosis.pm/safe-react-gateway-sdk'

import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { GATEWAY_URL } from 'src/utils/constants'
import { checksumAddress } from 'src/utils/checksumAddress'

export const isTransactionType = (value: TransactionListItem): value is Transaction => {
  return value.type === 'TRANSACTION'
}

const TxsToConfirmList = (): ReactElement => {
  const ownedSafes = useOwnerSafes()
  const userAccount = useSelector(userAccountSelector)
  const [loading, setLoading] = useState<boolean>(true)
  const [txsAwaitingConfirmation, setTxsAwaitingConfirmation] = useState<any>()

  const getTxsAwaitingYourSignatureByChainId = async (chainId: string, safeAddress: string): Promise<Transaction[]> => {
    const { results } = await getTransactionQueue(GATEWAY_URL, chainId, checksumAddress(safeAddress))

    // If there are no queued transactions
    if (!results.length) return []

    const awaitingConfirmationTxs = results
      .filter(isTransactionType)
      .filter(
        (result) =>
          result.transaction.txStatus === 'AWAITING_CONFIRMATIONS' &&
          result.transaction.executionInfo?.type === 'MULTISIG' &&
          result.transaction.executionInfo.missingSigners?.some((addr) => addr.value === userAccount),
      )

    return awaitingConfirmationTxs
  }

  useEffect(() => {
    const fetchAwaitingConfirmationTxs = async () => {
      const txs: any = []
      for (const [chainId, safesPerChain] of Object.entries(ownedSafes)) {
        const txsByChain: Transaction[] = []
        for (const safe of safesPerChain) {
          const confirmationAwaitingTxs = await getTxsAwaitingYourSignatureByChainId(chainId, safe)
          txsByChain.push(...confirmationAwaitingTxs)
        }
        txs.push([chainId, txsByChain])
      }
      setTxsAwaitingConfirmation(txs)
      setLoading(false)
    }
    fetchAwaitingConfirmationTxs()
  }, [ownedSafes])

  if (loading) {
    return <h3>Loading</h3>
  }

  return <div>TxsToConfirmList{JSON.stringify(txsAwaitingConfirmation)}</div>
}

export default TxsToConfirmList
