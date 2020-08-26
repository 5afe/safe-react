import { Transaction } from '@gnosis.pm/safe-apps-sdk'
import { AbiItem } from 'web3-utils'
import { MultiSend } from 'src/types/contracts/MultiSend.d'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { MULTI_SEND_ADDRESS } from 'src/logic/contracts/safeContracts'

const multiSendAbi: AbiItem[] = [
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

export const encodeMultiSendCall = (txs: Transaction[]): string => {
  const web3 = getWeb3()
  const multiSend = (new web3.eth.Contract(multiSendAbi, MULTI_SEND_ADDRESS) as unknown) as MultiSend

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

  const encodedMultiSendCallData = multiSend.methods.multiSend(`0x${joinedTxs}`).encodeABI()

  return encodedMultiSendCallData
}
