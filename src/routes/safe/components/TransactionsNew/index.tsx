import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { newTransactionsCurrentPageSelector } from '../../store/selectors/newTransactions'
import { useFetchNewTransactions } from '../../container/hooks/useFetchNewTransactions'
import { ButtonLink, Loader } from '@gnosis.pm/safe-react-components'
import { setPreviousPage } from '../../store/actions/transactionsNew/setPreviousPage'
import { setNextPage } from '../../store/actions/transactionsNew/setNextPage'

const Transactions = (): React.ReactElement => {
  const dispatch = useDispatch()
  const transactions = useSelector(newTransactionsCurrentPageSelector)
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
      <ButtonLink color="primary" onClick={() => previousPageButtonHandler()}>
        Previous Page
      </ButtonLink>
      <ButtonLink color="primary" onClick={() => nextPageButtonHandler()}>
        Next Page
      </ButtonLink>
    </>
  )
}

export default Transactions
