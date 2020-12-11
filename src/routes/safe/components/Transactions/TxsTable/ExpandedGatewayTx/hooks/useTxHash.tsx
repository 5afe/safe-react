import axios, { AxiosResponse } from 'axios'
import memoize from 'lodash/memoize'
import { useEffect, useState } from 'react'

import { getTxDetailsUrl } from 'src/config'
import { TransactionSummary } from 'src/logic/safe/store/models/types/gateway'
import { NOT_AVAILABLE } from 'src/routes/safe/components/Transactions/TxsTable/columns'

type ExpandedTxDetails = {
  executedAt: number
  txStatus: string
  txInfo: any
  txData: string | null
  detailedExecutionInfo: Record<string, string> | null
  txHash: string
}

// TODO: WIP -- this is here for ease of implementation
//  it should be implemented as a selector
//  also, `ExpandedTxDetails` type, is incomplete and should be defined inside `gateway.d.ts`
//{
// executedAt: 1604098453000,
// txStatus: "SUCCESS",
// txInfo: {},
// txData: null,
// detailedExecutionInfo: null,
// txHash: "0xaff6465ba25f0bc48f26299b74e12c0bc41d614e2995fdacce50066bb4b934dd"
// }
const txDetailedInfo = memoize(
  async (transaction: TransactionSummary): Promise<ExpandedTxDetails> => {
    const url = getTxDetailsUrl(transaction.id)
    const { data } = await axios.get<ExpandedTxDetails, AxiosResponse<ExpandedTxDetails>>(url)
    return data
  },
  (transaction: TransactionSummary) => {
    return `${transaction.txStatus}-${transaction.id}`
  },
)

const initialTxHashData = {
  loading: true,
  error: false,
  txHash: '',
}

export const useTxHash = (transaction: TransactionSummary): typeof initialTxHashData => {
  const [txHashData, setTxHashData] = useState<typeof initialTxHashData>(initialTxHashData)

  useEffect(() => {
    let isCurrent = true

    if (transaction.id) {
      txDetailedInfo(transaction)
        .then(({ txHash }) => isCurrent && setTxHashData({ loading: false, error: false, txHash }))
        .catch((error) => {
          console.error('Failed to retrieve tx details', error, transaction)
          isCurrent && setTxHashData({ loading: false, error: true, txHash: NOT_AVAILABLE })
        })
    }

    return () => {
      isCurrent = false
    }
  }, [transaction])

  return txHashData
}
