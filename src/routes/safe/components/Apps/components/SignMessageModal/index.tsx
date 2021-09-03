import { ReactElement } from 'react'
import { BytesLike, RequestId } from '@gnosis.pm/safe-apps-sdk'

import Modal from 'src/components/Modal'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { ReviewMessage } from './ReviewMessage'

export type ConfirmTxModalProps = {
  isOpen: boolean
  app: SafeApp
  message: BytesLike
  safeAddress: string
  safeName: string
  requestId: RequestId
  ethBalance: string
  onUserConfirm: (safeTxHash: string, requestId: RequestId) => void
  onTxReject: (requestId: RequestId) => void
  onClose: () => void
}

export const SignMessageModal = (props: ConfirmTxModalProps): ReactElement => {
  console.log(props.isOpen)

  return (
    <Modal description="Safe App transaction" title="Safe App transaction" open={props.isOpen}>
      <ReviewMessage {...props} />
    </Modal>
  )
}
