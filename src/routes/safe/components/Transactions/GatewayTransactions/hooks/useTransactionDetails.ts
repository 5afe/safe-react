import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchTransactionDetails } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { TxLocationContext } from 'src/routes/safe/components/Transactions/GatewayTransactions/TxLocationProvider'
import { getTransactionDetails } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { AppReduxState } from 'src/store'

export type LoadTransactionDetails = {
  data?: ExpandedTxDetails
  loading: boolean
}

export const useTransactionDetails = (transactionId: string): LoadTransactionDetails => {
  const { txLocation } = useContext(TxLocationContext)
  const dispatch = useRef(useDispatch())
  const [txDetails, setTxDetails] = useState<LoadTransactionDetails>({
    loading: true,
    data: undefined,
  })
  const data = useSelector((state: AppReduxState) =>
    getTransactionDetails(state)({ attributeValue: transactionId, attributeName: 'id', txLocation }),
  )

  useEffect(() => {
    if (data) {
      setTxDetails({ loading: false, data })
    } else {
      // lookup tx details
      dispatch.current(fetchTransactionDetails({ transactionId, txLocation }))
    }
  }, [data, transactionId, txLocation])

  return txDetails
}
