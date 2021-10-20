import { RequestId, calculateMessageHash } from '@gnosis.pm/safe-apps-sdk'
import { ReactElement } from 'react'

import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getSignMessageLibContractInstance, getSignMessageLibAddress } from 'src/logic/contracts/safeContracts'
import Modal from 'src/components/Modal'
import { getNetworkId } from 'src/config'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { ReviewMessage } from './ReviewMessage'

export type SignMessageModalProps = {
  isOpen: boolean
  app: SafeApp
  message: string
  safeAddress: string
  safeName: string
  requestId: RequestId
  ethBalance: string
  onUserConfirm: (safeTxHash: string, requestId: RequestId) => void
  onTxReject: (requestId: RequestId) => void
  onClose: () => void
}

const networkId = getNetworkId()

const convertToHumanReadableMessage = (message: string): string => {
  const web3 = getWeb3ReadOnly()
  const isHex = web3.utils.isHexStrict(message.toString())

  let humanReadableMessage = message
  if (isHex) {
    try {
      humanReadableMessage = web3.utils.hexToUtf8(message)
    } catch (e) {
      // do nothing
    }
  }

  return humanReadableMessage
}

export const SignMessageModal = ({ message, isOpen, ...rest }: SignMessageModalProps): ReactElement => {
  const web3 = getWeb3ReadOnly()
  const txRecipient = getSignMessageLibAddress(networkId) || ZERO_ADDRESS
  const txData = getSignMessageLibContractInstance(web3, networkId)
    .methods.signMessage(calculateMessageHash(message))
    .encodeABI()

  const readableData = convertToHumanReadableMessage(message)

  return (
    <Modal description="Safe App transaction" title="Safe App transaction" open={isOpen}>
      <ReviewMessage {...rest} txRecipient={txRecipient} txData={txData} utf8Message={readableData} />
    </Modal>
  )
}
