import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import {
  getMultiSendCallOnlyContract,
  getMultiSendCallOnlyContractAddress,
  getMultiSendContractAddress,
} from 'src/logic/contracts/safeContracts'
import { MultiSend, TransactionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { isCustomTxInfo } from 'src/logic/safe/store/models/types/gateway.d'
import { sameString } from 'src/utils/strings'

export interface MultiSendTx {
  to: string
  value: string
  data: string
}

export const encodeMultiSendCall = (txs: Transaction[]): string => {
  const multiSend = getMultiSendCallOnlyContract()
  const joinedTxs = getMultiSendJoinedTxs(txs)

  return multiSend.methods.multiSend(joinedTxs).encodeABI()
}

export const getMultiSendJoinedTxs = (txs: Transaction[]): string => {
  const web3 = getWeb3()

  const joinedTxs = txs
    .map((tx) =>
      [
        web3.eth.abi.encodeParameter('uint8', 0).slice(-2),
        web3.eth.abi.encodeParameter('address', tx.to).slice(-40),
        // if you pass wei as number, it will overflow
        web3.eth.abi.encodeParameter('uint256', tx.value.toString()).slice(-64),
        web3.eth.abi.encodeParameter('uint256', web3.utils.hexToBytes(tx.data).length).slice(-64),
        tx.data.replace(/^0x/, ''),
      ].join(''),
    )
    .join('')

  return `0x${joinedTxs}`
}

export const isSupportedMultiSendAddress = (txInfo: TransactionInfo): boolean => {
  const toAddress = isCustomTxInfo(txInfo) ? txInfo.to.value : ''
  const multiSendCallOnlyAddress = getMultiSendCallOnlyContractAddress()
  const multiSendAddress = getMultiSendContractAddress()

  return sameString(multiSendAddress, toAddress) || sameString(multiSendCallOnlyAddress, toAddress)
}

export const isSupportedMultiSendCall = (txInfo: TransactionInfo): txInfo is MultiSend =>
  isSupportedMultiSendAddress(txInfo) && isCustomTxInfo(txInfo) && txInfo.methodName === 'multiSend'
