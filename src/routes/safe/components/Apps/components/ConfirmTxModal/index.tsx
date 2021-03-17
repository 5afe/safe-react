import React, { ReactElement, useState } from 'react'
import Modal from 'src/components/Modal'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'

import { SafeApp } from 'src/routes/safe/components/Apps/types.d'
import { TransactionParams } from 'src/routes/safe/components/Apps/components/AppFrame'
import { mustBeEthereumAddress } from 'src/components/forms/validator'
import { SafeAppLoadError } from './SafeAppLoadError'
import { ReviewConfirm } from './ReviewConfirm'

export type ConfirmTxModalProps = {
  isOpen: boolean
  app: SafeApp
  txs: Transaction[]
  params?: TransactionParams
  safeAddress: string
  safeName: string
  ethBalance: string
  onUserConfirm: (safeTxHash: string) => void
  onTxReject: () => void
  onClose: () => void
}

const isTxValid = (t: Transaction): boolean => {
  if (!['string', 'number'].includes(typeof t.value)) {
    return false
  }

  if (typeof t.value === 'string' && !/^(0x)?[0-9a-f]+$/i.test(t.value)) {
    return false
  }

  const isAddressValid = mustBeEthereumAddress(t.to) === undefined
  return isAddressValid && !!t.data && typeof t.data === 'string'
}

export const ConfirmTxModal = (props: ConfirmTxModalProps): ReactElement => {
  const [decodedTxDetail /* setDecodedTxData */] = useState()
  const areTxsMalformed = props.txs.some((t) => !isTxValid(t))

  return (
    <Modal description="Safe App transaction" title="Safe App transaction" open={props.isOpen}>
      {areTxsMalformed && <SafeAppLoadError {...props} />}
      {decodedTxDetail && <div>decoded</div>}
      {!areTxsMalformed && !decodedTxDetail && <ReviewConfirm {...props} areTxsMalformed={areTxsMalformed} />}
    </Modal>
  )
}
