import {
  DEFAULT_FALLBACK_HANDLER_ADDRESS,
  MULTI_SEND_ADDRESS,
  SAFE_MASTER_COPY_ADDRESS,
  getEncodedMultiSendCallData,
  getGnosisSafeInstanceAt,
} from 'src/logic/contracts/safeContracts'
import { DELEGATE_CALL } from 'src/logic/safe/transactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

export const upgradeSafeToLatestVersion = async (safeAddress, createTransaction) => {
  const sendTransactions = async (txs) => {
    const web3 = getWeb3()
    const encodeMultiSendCallData = getEncodedMultiSendCallData(txs, web3)
    createTransaction({
      safeAddress,
      to: MULTI_SEND_ADDRESS,
      valueInWei: 0,
      txData: encodeMultiSendCallData,
      notifiedTransaction: 'STANDARD_TX',
      enqueueSnackbar: () => {},
      closeSnackbar: () => {},
      operation: DELEGATE_CALL,
    })
  }
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const fallbackHandlerTxData = safeInstance.contract.methods
    .setFallbackHandler(DEFAULT_FALLBACK_HANDLER_ADDRESS)
    .encodeABI()
  const updateSafeTxData = safeInstance.contract.methods.changeMasterCopy(SAFE_MASTER_COPY_ADDRESS).encodeABI()
  const txs = [
    {
      operation: 0,
      to: safeAddress,
      value: 0,
      data: updateSafeTxData,
    },
    {
      operation: 0,
      to: safeAddress,
      value: 0,
      data: fallbackHandlerTxData,
    },
  ]
  return sendTransactions(txs)
}
