import { createAction } from 'redux-actions'

import { Dispatch } from 'src/logic/safe/store/actions/types'
import { Transaction, TxLocation } from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionDetailsPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { safeAddressFromUrl } from 'src/logic/safe/store/selectors'
import { getTransactionDetails } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { AppReduxState } from 'src/store'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'

export const UPDATE_TRANSACTION_DETAILS = 'UPDATE_TRANSACTION_DETAILS'
const updateTransactionDetails = createAction<TransactionDetailsPayload>(UPDATE_TRANSACTION_DETAILS)

export const fetchTransactionDetails = ({
  transactionId,
  txLocation,
}: {
  transactionId: Transaction['id']
  txLocation: TxLocation
}) => async (dispatch: Dispatch, getState: () => AppReduxState): Promise<Transaction['txDetails']> => {
  const txDetails = getTransactionDetails(getState())({
    attributeValue: transactionId,
    attributeName: 'id',
    txLocation,
  })
  const safeAddress = safeAddressFromUrl(getState())

  if (txDetails || !safeAddress) {
    return
  }

  try {
    const transactionDetails = await fetchSafeTransaction(transactionId)

    dispatch(updateTransactionDetails({ transactionId, txLocation, safeAddress, value: transactionDetails }))
  } catch (error) {
    console.error(`Failed to retrieve transaction ${transactionId} details`, error.message)
  }
}
