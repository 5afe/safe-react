import React, { ReactElement, useState } from 'react'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'

import Modal from 'src/components/Modal'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { TransactionParams } from 'src/routes/safe/components/Apps/components/AppFrame'
import { mustBeEthereumAddress } from 'src/components/forms/validator'
import { SafeAppLoadError } from './SafeAppLoadError'
import { ReviewConfirm } from './ReviewConfirm'
import { DecodedDataParameterValue, DecodedData } from 'src/types/transactions/decode'
import { DecodedTxDetail } from './DecodedTxDetail'

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

export type DecodedTxDetail = DecodedDataParameterValue | DecodedData | undefined

export const ConfirmTxModal = (props: ConfirmTxModalProps): ReactElement | null => {
  const [decodedTxDetails, setDecodedTxDetails] = useState<DecodedTxDetail>()
  const areTxsMalformed = props.txs.some((t) => !isTxValid(t))

  const showDecodedTxData = setDecodedTxDetails
  const hideDecodedTxData = () => setDecodedTxDetails(undefined)

  const closeDecodedTxDetail = () => {
    hideDecodedTxData()
    props.onClose()
  }

  return (
    <Modal description="Safe App transaction" title="Safe App transaction" open={props.isOpen}>
      {areTxsMalformed && <SafeAppLoadError {...props} />}
      {decodedTxDetails && (
        <DecodedTxDetail
          onClose={closeDecodedTxDetail}
          hideDecodedTxData={hideDecodedTxData}
          decodedTxData={decodedTxDetails}
        />
      )}

      <ReviewConfirm
        {...props}
        areTxsMalformed={areTxsMalformed}
        showDecodedTxData={showDecodedTxData}
        hidden={areTxsMalformed || !!decodedTxDetails}
      />
    </Modal>
  )
}
