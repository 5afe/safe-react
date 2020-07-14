import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { currentPageSelector, newTransactionsCurrentPageSelector } from '../../store/selectors/newTransactions'
import { useFetchNewTransactions } from '../../container/hooks/useFetchNewTransactions'
import { safeParamAddressFromStateSelector } from '../../store/selectors'
import { ButtonLink } from '@gnosis.pm/safe-react-components'
import { setPreviousPage } from '../../store/actions/transactionsNew/setPreviousPage'
import { setNextPage } from '../../store/actions/transactionsNew/setNextPage'

const Transactions = (): React.ReactElement => {
  const transactions = useSelector(newTransactionsCurrentPageSelector)
  const { offset, limit } = useSelector(currentPageSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const dispatch = useDispatch()
  useFetchNewTransactions({ safeAddress, offset, limit })

  if (!transactions) return <div>No txs available for safe: {safeAddress}</div>

  const nextPageButtonHandler = () => {
    dispatch(setNextPage())
  }

  const previousPageButtonHandler = () => {
    dispatch(setPreviousPage())
  }

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
