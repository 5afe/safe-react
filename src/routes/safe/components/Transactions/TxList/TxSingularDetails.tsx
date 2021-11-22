import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'

import { isTxQueued } from 'src/logic/safe/store/models/types/gateway.d'
import { SafeRouteSlugs, TRANSACTION_HASH_SLUG } from 'src/routes/routes'
import { Centered } from './styled'
import {
  getTransactionWithLocationById,
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import { TxLocationContext } from './TxLocationProvider'
import { QueueTxList } from './QueueTxList'
import { HistoryTxList } from './HistoryTxList'
import { AppReduxState } from 'src/store'
import useSafeTxHashTx from './hooks/useSafeTxHashTx'

const TxSingularDetails = (): ReactElement => {
  const historyTxs = useSelector(historyTransactions)
  const nextTxs = useSelector(nextTransactions)
  const queueTxs = useSelector(queuedTransactions)
  const isLoaded = [historyTxs, nextTxs, queueTxs].every(Boolean)

  const { [TRANSACTION_HASH_SLUG]: safeTxHash = '' } = useParams<SafeRouteSlugs>()
  const fetchedTx = useSafeTxHashTx(safeTxHash)

  // We must use the tx from the store as the queue actions alter the tx
  const liveTx = useSelector((state: AppReduxState) => getTransactionWithLocationById(state, fetchedTx?.id || ''))

  if (!isLoaded || !liveTx) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }
  const { transaction, txLocation } = liveTx
  const TxList = isTxQueued(transaction.txStatus) ? QueueTxList : HistoryTxList

  return (
    <TxLocationContext.Provider value={{ txLocation }}>
      <TxList transactions={[[transaction.timestamp.toString(), [transaction]]]} />
    </TxLocationContext.Provider>
  )
}

export default TxSingularDetails
