import React, { ReactElement, useState } from 'react'

import Modal from 'src/components/Modal'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { ReviewConfirm } from './ReviewConfirm'

export type ConfirmTxModalProps = {
  isOpen: boolean
  app: SafeApp
  message: string
  safeAddress: string
  safeName: string
  ethBalance: string
  onUserConfirm: (safeTxHash: string) => void
  onTxReject: () => void
  onClose: () => void
}

export const SignMessageModal = (props: ConfirmTxModalProps): ReactElement => {
  return (
    <Modal description="Safe App transaction" title="Safe App transaction" open={props.isOpen}>
      {/* <ReviewConfirm
        {...props}
        areTxsMalformed={areTxsMalformed}
        showDecodedTxData={showDecodedTxData}
        hidden={areTxsMalformed || !!decodedTxDetails}
      /> */}
    </Modal>
  )
}
