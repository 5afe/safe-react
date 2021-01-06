import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchTransactionDetails } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { getTransactionDetails } from 'src/logic/safe/store/selectors/getTransactionDetails'

export const useTransactionDetails = (
  transactionId: string,
  txLocation: 'history' | 'queued.next' | 'queued.queued',
): { data?: ExpandedTxDetails; loading: boolean } => {
  const dispatch = useRef(useDispatch())
  const [txDetails, setTxDetails] = useState<{ data?: ExpandedTxDetails; loading: boolean }>({
    loading: true,
    data: undefined,
  })
  const data = useSelector((state) => getTransactionDetails(state, transactionId, txLocation))

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
