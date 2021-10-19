import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { getMultisendContract } from 'src/logic/contracts/safeContracts'

export interface MultiSendTx {
  to: string
  value: string
  data: string
}

export const encodeMultiSendCall = (txs: Transaction[]): string => {
  const web3 = getWeb3()
  const multiSend = getMultisendContract()

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

  const encodedMultiSendCallData = multiSend.methods.multiSend(`0x${joinedTxs}`).encodeABI()

  return encodedMultiSendCallData
}
