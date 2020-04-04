// 
import { Record } from 'immutable'

export const INCOMING_TX_TYPES = ['INCOMING', 'ERC721_TRANSFER', 'ERC20_TRANSFER', 'ETHER_TRANSFER']


export const makeIncomingTransaction = Record({
  blockNumber: 0,
  executionTxHash: '',
  safeTxHash: '',
  to: '',
  value: 0,
  tokenAddress: '',
  from: '',
  symbol: '',
  decimals: 18,
  fee: '',
  executionDate: '',
  type: 'INCOMING',
  status: 'success',
  nonce: null,
  confirmations: null,
  recipient: null,
  data: null,
  operation: null,
  safeTxGas: null,
  baseGas: null,
  gasPrice: null,
  gasToken: null,
  refundReceiver: null,
  isExecuted: null,
  submissionDate: null,
  executor: null,
  cancelled: null,
  modifySettingsTx: null,
  cancellationTx: null,
  customTx: null,
  creationTx: null,
  isTokenTransfer: null,
  decodedParams: null,
  refundParams: null,
})

