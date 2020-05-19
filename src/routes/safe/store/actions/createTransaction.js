//
import { push } from 'connected-react-router'
import semverSatisfies from 'semver/functions/satisfies'

import { onboardUser } from 'src/components/ConnectButton'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType, showSnackbar } from 'src/logic/notifications'
import { CALL, getApprovalTransaction, getExecutionTransaction, saveTxToHistory } from 'src/logic/safe/transactions'
import { estimateSafeTxGas } from 'src/logic/safe/transactions/gasNew'
import { SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES, tryOffchainSigning } from 'src/logic/safe/transactions/offchainSigner'
import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import fetchTransactions from 'src/routes/safe/store/actions/fetchTransactions'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/routes/safe/store/actions/utils'
import {} from 'src/store'
import { getErrorMessage } from 'src/test/utils/ethereumErrors'

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
}) => async (dispatch, getState) => {
  const state = getState()

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

  const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, origin)
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
    if (canTryOffchainSigning) {
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
          dispatch(fetchTransactions(safeAddress))
        } catch (err) {
          console.error(err)
        }
      })
      .on('error', (error) => {
        console.error('Tx error: ', error)
      })
      .then((receipt) => {
        closeSnackbar(pendingExecutionKey)
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
