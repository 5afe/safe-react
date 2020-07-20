import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { currentPageSelector, newTransactionsCurrentPageSelector } from '../../store/selectors/newTransactions'
import { useFetchNewTransactions } from '../../container/hooks/useFetchNewTransactions'
import { ButtonLink, Loader } from '@gnosis.pm/safe-react-components'
import { setNextPage, setPreviousPage } from '../../store/actions/transactionsNew/pagination'

const Transactions = (): React.ReactElement => {
  const dispatch = useDispatch()
  const transactions = useSelector(newTransactionsCurrentPageSelector)
  const { currentPage, maxPages } = useSelector(currentPageSelector)
  useFetchNewTransactions()

  const nextPageButtonHandler = () => {
    dispatch(setNextPage())
  }

  const previousPageButtonHandler = () => {
    dispatch(setPreviousPage())
  }

  if (!transactions) return <div>No txs available for safe</div>

  if (!transactions.length) return <Loader size="lg" />

  return (
    <>
      {transactions.map((tx, index) => {
        const txHash = tx.transactionHash || tx.txHash
        return <div key={index}>Tx hash: {txHash}</div>
      })}
      <ButtonLink color="primary" onClick={() => previousPageButtonHandler()} disabled={currentPage === 1}>
        Previous Page
      </ButtonLink>
      <ButtonLink color="primary" onClick={() => nextPageButtonHandler()} disabled={currentPage >= maxPages}>
        Next Page
      </ButtonLink>
    </>
  )
}

export default Transactions
