import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ExpandedTxDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchTransactionDetails } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { TxLocationContext } from 'src/routes/safe/components/Transactions/TxList/TxLocationProvider'
import { getTransactionDetails } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { AppReduxState } from 'src/store'

export type LoadTransactionDetails = {
  data?: ExpandedTxDetails
  loading: boolean
}

export const useTransactionDetails = (transaction: Transaction): LoadTransactionDetails => {
  const { txLocation } = useContext(TxLocationContext)
  const dispatch = useRef(useDispatch())
  const [txDetails, setTxDetails] = useState<LoadTransactionDetails>({
    loading: true,
    data: undefined,
  })
  const data = useSelector((state: AppReduxState) =>
    getTransactionDetails(state)({ attributeValue: transaction.id, attributeName: 'id', txLocation }),
  )

  useEffect(() => {
    if (data) {
      setTxDetails({ loading: false, data })
    } else {
      // lookup tx details
      dispatch.current(fetchTransactionDetails({ transactionId: transaction.id, txLocation }))
    }
  }, [data, transaction, txLocation])

  return txDetails
}
