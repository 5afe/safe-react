//
import { List, Record } from 'immutable'

import { ZERO_ADDRESS } from 'logic/wallets/ethAddresses'
import {} from 'routes/safe/store/models/confirmation'

export const OUTGOING_TX_TYPE = 'outgoing'

export const makeTransaction = Record({
  nonce: 0,
  blockNumber: 0,
  value: 0,
  confirmations: List([]),
  recipient: '',
  data: null,
  operation: 0,
  safeTxGas: 0,
  baseGas: 0,
  gasPrice: 0,
  gasToken: ZERO_ADDRESS,
  refundReceiver: ZERO_ADDRESS,
  isExecuted: false,
  isSuccessful: true,
  submissionDate: '',
  executor: '',
  executionDate: '',
  symbol: '',
  executionTxHash: undefined,
  safeTxHash: '',
  cancelled: false,
  modifySettingsTx: false,
  cancellationTx: false,
  customTx: false,
  creationTx: false,
  multiSendTx: false,
  upgradeTx: false,
  status: 'awaiting',
  decimals: 18,
  isTokenTransfer: false,
  decodedParams: {},
  refundParams: null,
  type: 'outgoing',
  origin: null,
})
