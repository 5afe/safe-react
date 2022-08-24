import { RequestId, Methods } from '@gnosis.pm/safe-apps-sdk'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { hexToUtf8, isHexStrict } from 'web3-utils'

import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getSignMessageLibContractInstance, getSignMessageLibAddress } from 'src/logic/contracts/safeContracts'
import Modal from 'src/components/Modal'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { ReviewMessage } from './ReviewMessage'
import { currentChainId } from 'src/logic/config/store/selectors'

import { _TypedDataEncoder } from '@ethersproject/hash'

export type SignMessageModalProps = {
  isOpen: boolean
  app: SafeApp
  message: string
  safeAddress: string
  safeName: string
  requestId: RequestId
  method: string
  ethBalance: string
  onUserConfirm: (safeTxHash: string, requestId: RequestId) => void
  onTxReject: (requestId: RequestId) => void
  onClose: () => void
}

const convertToHumanReadableMessage = (message: string): string => {
  const isHex = isHexStrict(message.toString())

  let humanReadableMessage = message
  if (isHex) {
    try {
      humanReadableMessage = hexToUtf8(message)
    } catch (e) {
      // do nothing
    }
  }

  return humanReadableMessage
}

export const SignMessageModal = ({ message, isOpen, method, ...rest }: SignMessageModalProps): ReactElement => {
  const web3 = getWeb3ReadOnly()
  const networkId = useSelector(currentChainId)
  const txRecipient = getSignMessageLibAddress(networkId) || ZERO_ADDRESS
  let txData, readableData
  if (method == Methods.signMessage) {
    txData = getSignMessageLibContractInstance(web3, networkId)
      .methods.signMessage(web3.eth.accounts.hashMessage(message))
      .encodeABI()
    readableData = convertToHumanReadableMessage(message)
  } else if (method == Methods.signTypedMessage) {
    // check if the message is a valid typed data
    try {
      const typedData = JSON.parse(message)
      if (!('domain' in typedData && 'types' in typedData && 'message' in typedData)) {
        throw new Error('Invalid typed data')
      }
      readableData = JSON.stringify(typedData, undefined, 4)
    } catch (e) {
      // As the signing method is SignTypedMessage, the message should be a valid JSON.
      // When it is not, we will reject the tx and close the modal.
      rest.onTxReject(rest.requestId)
      rest.onClose()
    }
    // Here we firstly convert the typed message to safe typed message which contains the safe address and the current chainId,
    // then we hash it using ethers.utils._TypedDataEncoder.
    txData = getSignMessageLibContractInstance(web3, networkId)
      .methods.signMessage(
        _TypedDataEncoder.hash(
          { verifyingContract: rest.safeAddress, chainId: parseInt(networkId) },
          { SafeMessage: [{ type: 'string', name: 'message' }] },
          { message: message },
        ),
      )
      .encodeABI()
  } else {
    // Unsupported method
    rest.onTxReject(rest.requestId)
    rest.onClose()
  }

  return (
    <Modal description="Safe App transaction" title="Safe App transaction" open={isOpen}>
      <ReviewMessage {...rest} txRecipient={txRecipient} method={method} txData={txData} utf8Message={readableData} />
    </Modal>
  )
}
