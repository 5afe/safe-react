import { createAction } from 'redux-actions'

import { Dispatch } from 'src/logic/safe/store/actions/types'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionDetailsPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { AppReduxState } from 'src/store'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { currentChainId } from 'src/logic/config/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'

export const UPDATE_TRANSACTION_DETAILS = 'UPDATE_TRANSACTION_DETAILS'
const updateTransactionDetails = createAction<TransactionDetailsPayload>(UPDATE_TRANSACTION_DETAILS)

export const fetchTransactionDetails =
  ({ transactionId }: { transactionId: Transaction['id'] }) =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<undefined | Transaction['txDetails']> => {
    const transaction = getTransactionByAttribute(getState(), {
      attributeValue: transactionId,
      attributeName: 'id',
    })
    const safeAddress = extractSafeAddress()
    const chainId = currentChainId(getState())

    if (transaction?.txDetails || !safeAddress) {
      return
    }

    try {
      const transactionDetails = await fetchSafeTransaction(transactionId)

      dispatch(updateTransactionDetails({ chainId, transactionId, safeAddress, value: transactionDetails }))
      return transactionDetails
    } catch (error) {
      console.error(`Failed to retrieve transaction ${transactionId} details`, error.message)
    }
  }
