import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  getTransactionQueue,
  Transaction,
  TransactionSummary,
  TransactionListItem,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { default as MuiIconButton } from '@material-ui/core/IconButton'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { Icon } from '@gnosis.pm/safe-react-components'

import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { GATEWAY_URL } from 'src/utils/constants'
import { checksumAddress } from 'src/utils/checksumAddress'
import styled from 'styled-components'
import { List } from '@material-ui/core'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { getChainById } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import { isMultisigExecutionInfo } from 'src/logic/safe/store/models/types/gateway.d'

export const isTransactionType = (value: TransactionListItem): value is Transaction => {
  return value.type === 'TRANSACTION'
}

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

  console.log('txsAwaitingConfirmation', txsAwaitingConfirmation)
  if (loading || Object.keys(txsAwaitingConfirmation).length === 0) {
    return <h3>Loading</h3>
  }

  return (
    <List component="div">
      {Object.entries(txsAwaitingConfirmation).map((chain, idx) => {
        const [chainId, transactions] = chain
        if (!transactions.length) return null
        const chainData = getChainById(chainId)
        return (
          <div key={`${chain}_${idx}`}>
            <NetworkLabel networkInfo={chainData} />
            {transactions.map((tx, idx) => {
              const [, safeHash] = tx.id.split('_')
              if (!isMultisigExecutionInfo(tx.executionInfo)) return null
              return (
                <TransactionToConfirm key={`${tx.id}_${idx}`}>
                  <span style={{ fontWeight: 'bold' }}>{`#${tx.executionInfo.nonce}`}</span>
                  <EthHashInfo textSize="lg" hash={safeHash} shortenHash={8} />
                  <span>
                    <IconButton size="small" type="button">
                      <Icon type={'check'} color="primary" size="sm" />
                    </IconButton>
                  </span>
                </TransactionToConfirm>
              )
            })}
          </div>
        )
      })}
    </List>
  )
}

export default TxsToConfirmList

const TransactionToConfirm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin: 16px auto;
  background-color: #cecece;
  border-radius: 4px;
  padding: 4px;
`

const IconButton = styled(MuiIconButton)`
  padding: 8px !important;
`
