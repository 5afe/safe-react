// @flow
import { push } from 'connected-react-router'
import { List } from 'immutable'
import type { GetState, Dispatch as ReduxDispatch } from 'redux'
import semverSatisfies from 'semver/functions/satisfies'

import { makeConfirmation } from '../models/confirmation'

import updateTransaction from './updateTransaction'

import { onboardUser } from '~/components/ConnectButton'
import { nameFromAddressBookSelector } from '~/logic/addressBook/store/selectors/index'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { type NotificationsQueue, getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import {
  CALL,
  type NotifiedTransaction,
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
} from '~/logic/safe/transactions'
import { estimateSafeTxGas } from '~/logic/safe/transactions/gasNew'
import { SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES, tryOffchainSigning } from '~/logic/safe/transactions/offchainSigner'
import { getCurrentSafeVersion } from '~/logic/safe/utils/safeVersion'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { providerSelector } from '~/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from '~/routes/safe/store/actions/utils'
import { type GlobalState } from '~/store'
import { getErrorMessage } from '~/test/utils/ethereumErrors'

export type CreateTransactionArgs = {
  safeAddress: string,
  to: string,
  valueInWei: string,
  txData: string,
  notifiedTransaction: $Values<NotifiedTransaction>,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  txNonce?: number,
  operation?: 0 | 1,
  navigateToTransactionsTab?: boolean,
  origin?: string | null,
}

const createTransaction = ({
  safeAddress,
  to,
  valueInWei,
  txData = EMPTY_DATA,
  notifiedTransaction,
  enqueueSnackbar,
  closeSnackbar,
  txNonce,
  operation = CALL,
  navigateToTransactionsTab = true,
  origin = null,
}: CreateTransactionArgs) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  if (navigateToTransactionsTab) {
    dispatch(push(`${SAFELIST_ADDRESS}/${safeAddress}/transactions`))
  }

  const ready = await onboardUser()
  if (!ready) return

  const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(txNonce, lastTx, safeInstance)
  const isExecution = await shouldExecuteTransaction(safeInstance, nonce, lastTx)
  const safeVersion = await getCurrentSafeVersion(safeInstance)
  const safeTxGas = await estimateSafeTxGas(safeInstance, safeAddress, txData, to, valueInWei, operation)

  // https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
  const sigs = `0x000000000000000000000000${from.replace(
    '0x',
    '',
  )}000000000000000000000000000000000000000000000000000000000000000001`

  const notificationsQueue: NotificationsQueue = getNotificationsFromTxType(notifiedTransaction, origin)
  const beforeExecutionKey = showSnackbar(notificationsQueue.beforeExecution, enqueueSnackbar, closeSnackbar)
  let pendingExecutionKey

  let txHash
  let tx
  const txArgs = {
    safeInstance,
    to,
    valueInWei,
    data: txData,
    operation,
    nonce,
    safeTxGas,
    baseGas: 0,
    gasPrice: 0,
    gasToken: ZERO_ADDRESS,
    refundReceiver: ZERO_ADDRESS,
    sender: from,
    sigs,
  }

  try {
    // Here we're checking that safe contract version is greater or equal 1.1.1, but
    // theoretically EIP712 should also work for 1.0.0 contracts
    // Also, offchain signatures are not working for ledger/trezor wallet because of a bug in their library:
    // https://github.com/LedgerHQ/ledgerjs/issues/378
    // Couldn't find an issue for trezor but the error is almost the same
    const canTryOffchainSigning =
      !isExecution && !smartContractWallet && semverSatisfies(safeVersion, SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES)
    if (false) {
      const signature = await tryOffchainSigning({ ...txArgs, safeAddress }, hardwareWallet)

      if (signature) {
        closeSnackbar(beforeExecutionKey)

        await saveTxToHistory({
          ...txArgs,
          signature,
          origin,
        })
        showSnackbar(notificationsQueue.afterExecution.moreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)

        dispatch(fetchTransactions(safeAddress))
        return
      }
    }

    tx = isExecution ? await getExecutionTransaction(txArgs) : await getApprovalTransaction(txArgs)

    const sendParams = { from, value: 0 }

    // TODO find a better solution for this in dev and production.
    if (process.env.REACT_APP_ENV !== 'production') {
      sendParams.gasLimit = 1000000
    }

    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    await tx
      .send(sendParams)
      .once('transactionHash', async (hash) => {
        txHash = hash
        closeSnackbar(beforeExecutionKey)

        pendingExecutionKey = showSnackbar(notificationsQueue.pendingExecution, enqueueSnackbar, closeSnackbar)

        try {
          await saveTxToHistory({
            ...txArgs,
            txHash,
            origin,
          })
          await dispatch(fetchTransactions(safeAddress))
        } catch (err) {
          console.error(err)
        }
      })
      .on('error', (error) => {
        console.error('Tx error: ', error)
      })
      .then((receipt) => {
        console.log(receipt)
        closeSnackbar(pendingExecutionKey)
        const safeTxHash = isExecution
          ? receipt.events.ExecutionSuccess.returnValues[0]
          : receipt.events.ApproveHash.returnValues[0]

        dispatch(
          updateTransaction({
            safeAddress,
            transaction: {
              safeTxHash,
              isExecuted: isExecution,
              isSuccessful: isExecution ? true : null,
              executionTxHash: isExecution ? receipt.transactionHash : null,
              executor: isExecution ? from : null,
              confirmations: List([
                makeConfirmation({
                  type: 'confirmation',
                  hash: receipt.transactionHash,
                  signature: sigs,
                  owner: { address: from, name: nameFromAddressBookSelector(state, from) },
                }),
              ]),
            },
          }),
        )

        showSnackbar(
          isExecution
            ? notificationsQueue.afterExecution.noMoreConfirmationsNeeded
            : notificationsQueue.afterExecution.moreConfirmationsNeeded,
          enqueueSnackbar,
          closeSnackbar,
        )

        dispatch(fetchTransactions(safeAddress))

        return receipt.transactionHash
      })
  } catch (err) {
    console.error(err)
    closeSnackbar(beforeExecutionKey)
    closeSnackbar(pendingExecutionKey)
    showSnackbar(notificationsQueue.afterExecutionError, enqueueSnackbar, closeSnackbar)

    const executeDataUsedSignatures = safeInstance.contract.methods
      .execTransaction(to, valueInWei, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
      .encodeABI()
    const errMsg = await getErrorMessage(safeInstance.address, 0, executeDataUsedSignatures, from)
    console.error(`Error creating the TX: ${errMsg}`)
  }

  return txHash
}

export default createTransaction
