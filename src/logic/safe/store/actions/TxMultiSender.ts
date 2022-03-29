import { Dispatch } from './types'
import { isMultisigExecutionInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { MultiSend } from 'src/types/contracts/multi_send.d'
import { addPendingTransaction, removePendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { getMultisendContract } from 'src/logic/contracts/safeContracts'
import { createTxNotifications } from 'src/logic/notifications'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { isWalletRejection } from 'src/logic/wallets/errors'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { _getChainId } from 'src/config'

type TxMultiSenderProps = {
  transactions: Transaction[]
  multiSendCallData: string
  dispatch: Dispatch
  account: string
  safeAddress: string
}

export class TxMultiSender {
  transactions: Transaction[]
  multiSendCallData: string
  multiSendContract: MultiSend
  dispatch: Dispatch
  account: string
  safeAddress: string
  notifications: ReturnType<typeof createTxNotifications>

  constructor({ transactions, multiSendCallData, dispatch, account, safeAddress }: TxMultiSenderProps) {
    this.transactions = transactions
    this.multiSendCallData = multiSendCallData
    this.multiSendContract = getMultisendContract()
    this.dispatch = dispatch
    this.account = account
    this.notifications = createTxNotifications(TX_NOTIFICATION_TYPES.STANDARD_TX, null, dispatch)
    this.safeAddress = safeAddress
  }

  async sendTx(): Promise<void> {
    const { transactions, multiSendCallData, multiSendContract, dispatch, account } = this

    try {
      await multiSendContract.methods
        .multiSend(multiSendCallData)
        .send({
          from: account,
        })
        .on('transactionHash', (txHash) => {
          transactions.forEach((tx) => {
            const txNonce = isMultisigExecutionInfo(tx.executionInfo) ? tx.executionInfo.nonce : undefined
            txNonce && aboutToExecuteTx.setNonce(txNonce)
            dispatch(addPendingTransaction({ id: tx.id, txHash }))
            this.onComplete()
          })
        })
    } catch (error) {
      logError(Errors._818, error.message)
      this.onError(error)
    }
  }

  onComplete(): void {
    const { dispatch, safeAddress } = this

    dispatch(fetchTransactions(_getChainId(), safeAddress))
  }

  onError(err: Error & { code: number }): void {
    const { transactions, notifications, dispatch } = this

    notifications.closePending()

    transactions.forEach(({ id }) => {
      dispatch(removePendingTransaction({ id }))
    })

    if (isWalletRejection(err)) {
      notifications.showOnRejection(err)
    }
  }
}

export const createMultiSendTransaction = (props: TxMultiSenderProps): Promise<void> => {
  const sender = new TxMultiSender(props)

  return sender.sendTx()
}
