import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { currentPageSelector, newTransactionsCurrentPageSelector } from '../../store/selectors/newTransactions'
import { useFetchNewTransactions } from '../../container/hooks/useFetchNewTransactions'
import { ButtonLink, Loader } from '@gnosis.pm/safe-react-components'
import { nextPage, previousPage } from '../../store/actions/transactionsNew/pagination'
import { Transaction } from '../../store/models/types/transactions'
import { safeParamAddressFromStateSelector } from '../../store/selectors'

const Transactions = (): React.ReactElement => {
  const dispatch = useDispatch()
  const transactions = useSelector(newTransactionsCurrentPageSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { currentPage, maxPages, limit, offset } = useSelector(currentPageSelector)
  useFetchNewTransactions({ safeAddress, offset, limit })

  // TODO: Remove this once we implement infinite scroll
  const nextPageButtonHandler = () => {
    dispatch(nextPage())
  }

  const previousPageButtonHandler = () => {
    dispatch(previousPage())
  }

  if (!transactions) return <div>No txs available for safe</div>

  if (!transactions.length) return <Loader size="lg" />

  return (
    <>
      {transactions.map((tx: Transaction) => {
        let txHash = ''
        if ('transactionHash' in tx) {
          txHash = tx.transactionHash
        }
        if ('txHash' in tx) {
          txHash = tx.txHash
        }
        return <div key={txHash}>Tx hash: {txHash}</div>
      })}
      <ButtonLink color="primary" onClick={previousPageButtonHandler} disabled={currentPage === 1}>
        Previous Page
      </ButtonLink>
      <ButtonLink color="primary" onClick={nextPageButtonHandler} disabled={currentPage >= maxPages}>
        Next Page
      </ButtonLink>
    </>
  )
}

export default Transactions
