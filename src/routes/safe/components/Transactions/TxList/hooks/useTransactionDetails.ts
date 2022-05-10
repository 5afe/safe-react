import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchTransactionDetails } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { AppReduxState } from 'src/store'

export type LoadTransactionDetails = {
  data?: ExpandedTxDetails
  loading: boolean
}

export const useTransactionDetails = (
  transactionId: string,
  transactionDetails?: ExpandedTxDetails,
): LoadTransactionDetails => {
  const dispatch = useRef(useDispatch())
  const [txDetails, setTxDetails] = useState<LoadTransactionDetails>({
    loading: transactionDetails ? false : true,
    data: transactionDetails,
  })

  const data = useSelector((state: AppReduxState) =>
    getTransactionByAttribute(state, { attributeValue: transactionId, attributeName: 'id' }),
  )

  useEffect(() => {
    if (data?.txDetails) {
      setTxDetails({ loading: false, data: data?.txDetails })
    } else {
      // lookup tx details
      dispatch.current(fetchTransactionDetails({ transactionId }))
    }
  }, [data?.txDetails, transactionId])

  return txDetails
}
