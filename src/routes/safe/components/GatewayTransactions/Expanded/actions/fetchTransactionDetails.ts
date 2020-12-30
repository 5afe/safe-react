import axios, { AxiosResponse } from 'axios'
import { createAction } from 'redux-actions'

import { getTxDetailsUrl } from 'src/config'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { ExpandedTxDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionDetailsPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { getTransactionDetails } from 'src/routes/safe/components/GatewayTransactions/Expanded/selectors/getTransactionDetails'
import { AppReduxState } from 'src/store'

export const UPDATE_TRANSACTION_DETAILS = 'UPDATE_TRANSACTION_DETAILS'
const updateTransactionDetails = createAction<TransactionDetailsPayload>(UPDATE_TRANSACTION_DETAILS)

export const fetchTransactionDetails = ({
  transactionId,
  txLocation,
}: {
  transactionId: Transaction['id']
  txLocation: 'history' | 'queued.next' | 'queued.queued'
}) => async (dispatch: Dispatch, getState: () => AppReduxState): Promise<Transaction['txDetails']> => {
  const txDetails = getTransactionDetails(getState(), transactionId, txLocation)
  const safeAddress = safeParamAddressFromStateSelector(getState())

  if (txDetails) {
    return
  }

  try {
    const url = getTxDetailsUrl(transactionId)
    const { data: transactionDetails } = await axios.get<ExpandedTxDetails, AxiosResponse<ExpandedTxDetails>>(url)

    dispatch(updateTransactionDetails({ transactionId, txLocation, safeAddress, value: transactionDetails }))
  } catch (error) {
    console.error(`Failed to retrieve transaction ${transactionId} details`, error.message)
  }
}
