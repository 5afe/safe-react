import axios, { AxiosResponse } from 'axios'
import { createAction } from 'redux-actions'

import { getTxDetailsUrl } from 'src/config'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { ExpandedTxDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { UpdateTxPayload } from 'src/logic/safe/store/reducer/incomingTransactions'
import { getTransactionDetails } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedGatewayTx/selectors/getTransactionDetails'
import { AppReduxState } from 'src/store'

const updateTransactionDetails = createAction<UpdateTxPayload>('UPDATE_TRANSACTION_DETAILS')

export const fetchTransactionDetails = (transactionId: Transaction['id']) => async (
  dispatch: Dispatch,
  getState: () => AppReduxState,
): Promise<Transaction['txDetails']> => {
  const txDetails = getTransactionDetails(getState(), transactionId)

  if (txDetails) {
    return
  }

  try {
    const url = getTxDetailsUrl(transactionId)
    const { data: transactionDetails } = await axios.get<ExpandedTxDetails, AxiosResponse<ExpandedTxDetails>>(url)

    dispatch(updateTransactionDetails({ transactionId, transactionDetails }))
  } catch (error) {
    console.error(`Failed to retrieve transaction ${transactionId} details`, error.message)
  }
}
