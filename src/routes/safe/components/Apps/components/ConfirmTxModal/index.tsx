import { ReactElement } from 'react'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'
import { RequestId } from '@gnosis.pm/safe-apps-sdk'
import { DecodedDataParameterValue, DecodedDataResponse } from '@gnosis.pm/safe-react-gateway-sdk'

import Modal from 'src/components/Modal'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
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
  requestId: RequestId
  ethBalance: string
  onUserConfirm: (safeTxHash: string, requestId: RequestId) => void
  onTxReject: (requestId: RequestId) => void
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

export type DecodedTxDetailType = DecodedDataParameterValue | DecodedDataResponse | undefined

export const ConfirmTxModal = (props: ConfirmTxModalProps): ReactElement => {
  const invalidTransactions = !props.txs.length || props.txs.some((t) => !isTxValid(t))

  const rejectTransaction = () => {
    props.onClose()
    props.onTxReject(props.requestId)
  }

  if (invalidTransactions) {
    return (
      <Modal description="Safe App transaction" title="Safe App transaction" open={props.isOpen}>
        <SafeAppLoadError {...props} />
      </Modal>
    )
  }

  return (
    <Modal description="Safe App transaction" title="Safe App transaction" open={props.isOpen}>
      <ReviewConfirm {...props} onReject={rejectTransaction} />
    </Modal>
  )
}
