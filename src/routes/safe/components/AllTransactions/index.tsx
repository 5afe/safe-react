import React, { useEffect, useState } from 'react'
import { useTransactions } from 'src/routes/safe/container/hooks/useTransactions'
import { ButtonLink, Loader } from '@gnosis.pm/safe-react-components'
import { Transaction } from 'src/logic/safe/store/models/types/transactions.d'

const Transactions = (): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(0)
  const [limit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [maxPages, setMaxPages] = useState(0)
  const { transactions, totalTransactionsCount } = useTransactions({ offset, limit })
  const [transactionsByPage, setTransactionsByPage] = useState(transactions)

  useEffect(() => {
    const currentPage = Math.floor(offset / limit) + 1
    const maxPages = Math.ceil(totalTransactionsCount / limit)
    setCurrentPage(currentPage)
    setMaxPages(maxPages)
    const newTransactionsByPage = transactions ? transactions.slice(offset, offset * 2 || limit) : []
    setTransactionsByPage(newTransactionsByPage)
  }, [offset, limit, totalTransactionsCount, transactions])

  // TODO: Remove this once we implement infinite scroll
  const nextPageButtonHandler = () => {
    setOffset(offset + limit)
  }

  const previousPageButtonHandler = () => {
    setOffset(offset > 0 ? offset - limit : offset)
  }

  if (!transactionsByPage) return <div>No txs available for safe</div>

  if (!transactionsByPage.length) return <Loader size="lg" />

  return (
    <>
      {transactionsByPage.map((tx: Transaction, index) => {
        let txHash = ''
        if ('transactionHash' in tx) {
          txHash = tx.transactionHash as string
        }
        if ('txHash' in tx) {
          txHash = tx.txHash
        }
        return <div key={txHash || tx.executionDate || index}>Tx hash: {txHash}</div>
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
