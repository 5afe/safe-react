import { RequestId, Methods, EIP712TypedData, isObjectEIP712TypedData } from '@gnosis.pm/safe-apps-sdk'
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
  message: string | EIP712TypedData
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

export const SignMessageModal = ({ message, isOpen, method, ...rest }: SignMessageModalProps): ReactElement | null => {
  const web3 = getWeb3ReadOnly()
  const networkId = useSelector(currentChainId)
  const txRecipient = getSignMessageLibAddress(networkId) || ZERO_ADDRESS
  let txData, readableData
  if (method == Methods.signMessage && typeof message === 'string') {
    txData = getSignMessageLibContractInstance(web3, networkId)
      .methods.signMessage(web3.eth.accounts.hashMessage(message))
      .encodeABI()
    readableData = convertToHumanReadableMessage(message)
  } else if (method == Methods.signTypedMessage) {
    try {
      if (!isObjectEIP712TypedData(message)) {
        throw new Error('Invalid typed data')
      }
      readableData = JSON.stringify(message, undefined, 4)
    } catch (e) {
      // As the signing method is SignTypedMessage, the message should be a valid JSON.
      // When it is not, we will reject the tx and close the modal.
      rest.onTxReject(rest.requestId)
      rest.onClose()
      return null
    }
    const typesCopy = { ...message.types }

    // We need to remove the EIP712Domain type from the types object
    // Because it's a part of the JSON-RPC payload, but for the `.hash` in ethers.js
    // The types are not allowed to be recursive, so ever type must either be used by another type, or be
    // the primary type. And there must only be one type that is not used by any other type.
    delete typesCopy.EIP712Domain
    txData = getSignMessageLibContractInstance(web3, networkId)
      .methods.signMessage(_TypedDataEncoder.hash(message.domain, typesCopy, message.message))
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
