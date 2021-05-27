import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import {
  DEFAULT_FALLBACK_HANDLER_ADDRESS,
  MULTI_SEND_ADDRESS,
  SAFE_MASTER_COPY_ADDRESS,
  getGnosisSafeInstanceAt,
} from 'src/logic/contracts/safeContracts'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { MultiSend } from 'src/types/contracts/MultiSend.d'

export interface MultiSendTx {
  to: string
  value: number
  data: string
}

export const getEncodedMultiSendCallData = (txs: MultiSendTx[], web3: Web3): string => {
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
  const multiSend = (new web3.eth.Contract(multiSendAbi, MULTI_SEND_ADDRESS) as unknown) as MultiSend
  const encodedMultiSendCallData = multiSend.methods
    .multiSend(
      `0x${txs
        .map((tx) =>
          [
            web3.eth.abi.encodeParameter('uint8', 0).slice(-2),
            web3.eth.abi.encodeParameter('address', tx.to).slice(-40),
            web3.eth.abi.encodeParameter('uint256', tx.value).slice(-64),
            web3.eth.abi.encodeParameter('uint256', web3.utils.hexToBytes(tx.data).length).slice(-64),
            tx.data.replace(/^0x/, ''),
          ].join(''),
        )
        .join('')}`,
    )
    .encodeABI()

  return encodedMultiSendCallData
}

export const getUpgradeSafeTransactionHash = async (safeAddress: string): Promise<string> => {
  const safeInstance = getGnosisSafeInstanceAt(safeAddress)
  const fallbackHandlerTxData = safeInstance.methods.setFallbackHandler(DEFAULT_FALLBACK_HANDLER_ADDRESS).encodeABI()
  const updateSafeTxData = safeInstance.methods.changeMasterCopy(SAFE_MASTER_COPY_ADDRESS).encodeABI()
  const txs = [
    {
      to: safeAddress,
      value: 0,
      data: updateSafeTxData,
    },
    {
      to: safeAddress,
      value: 0,
      data: fallbackHandlerTxData,
    },
  ]

  const web3 = getWeb3()
  return getEncodedMultiSendCallData(txs, web3)
}
