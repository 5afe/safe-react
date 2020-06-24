import { DELEGATE_CALL } from 'src/logic/safe/transactions/send'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import createTransaction from 'src/routes/safe/store/actions/createTransaction'

const multiSendAddress = '0xB522a9f781924eD250A11C54105E51840B138AdD'
const multiSendAbi = [
  {
    type: 'function',
    name: 'multiSend',
    constant: false,
    payable: false,
    stateMutability: 'nonpayable',
    inputs: [{ type: 'bytes', name: 'transactions' }],
    outputs: [],
  },
]

const sendTransactions = (dispatch, safeAddress, txs, enqueueSnackbar, closeSnackbar, origin) => {
  const web3 = getWeb3()
  const multiSend: any = new web3.eth.Contract(multiSendAbi as any, multiSendAddress)

  const joinedTxs = txs
    .map((tx) =>
      [
        web3.eth.abi.encodeParameter('uint8', 0).slice(-2),
        web3.eth.abi.encodeParameter('address', tx.to).slice(-40),
        web3.eth.abi.encodeParameter('uint256', tx.value).slice(-64),
        web3.eth.abi.encodeParameter('uint256', web3.utils.hexToBytes(tx.data).length).slice(-64),
        tx.data.replace(/^0x/, ''),
      ].join(''),
    )
    .join('')

  const encodeMultiSendCallData = multiSend.methods.multiSend(`0x${joinedTxs}`).encodeABI()

  return dispatch(
    createTransaction({
      safeAddress,
      to: multiSendAddress,
      valueInWei: 0,
      txData: encodeMultiSendCallData,
      notifiedTransaction: 'STANDARD_TX',
      enqueueSnackbar,
      closeSnackbar,
      operation: DELEGATE_CALL,
      // navigateToTransactionsTab: false,
      origin,
    } as any),
  )
}
export default sendTransactions
