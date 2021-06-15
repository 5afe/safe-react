import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'

import { CheckOwner } from './screens/CheckOwner'
import { ReviewRemoveOwnerModal } from './screens/Review'
import { ThresholdForm } from './screens/ThresholdForm'

import Modal from 'src/components/Modal'
import { SENTINEL_ADDRESS, getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { safeAddressFromUrl } from 'src/logic/safe/store/selectors'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

type OwnerValues = OwnerData & {
  threshold: string
}

export const sendRemoveOwner = async (
  values: OwnerValues,
  safeAddress: string,
  ownerAddressToRemove: string,
  ownerNameToRemove: string,
  dispatch: Dispatch,
  txParameters: TxParameters,
): Promise<void> => {
  const gnosisSafe = getGnosisSafeInstanceAt(safeAddress)
  const safeOwners = await gnosisSafe.methods.getOwners().call()
  const index = safeOwners.findIndex(
    (ownerAddress) => ownerAddress.toLowerCase() === ownerAddressToRemove.toLowerCase(),
  )
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
  const txData = gnosisSafe.methods.removeOwner(prevAddress, ownerAddressToRemove, values.threshold).encodeABI()

  dispatch(
    createTransaction({
      safeAddress,
      to: safeAddress,
      valueInWei: '0',
      txData,
      txNonce: txParameters.safeNonce,
      safeTxGas: txParameters.safeTxGas ? Number(txParameters.safeTxGas) : undefined,
      ethParameters: txParameters,
      notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
    }),
  )
}

type RemoveOwnerProps = {
  isOpen: boolean
  onClose: () => void
  owner: OwnerData
}

export const RemoveOwnerModal = ({ isOpen, onClose, owner }: RemoveOwnerProps): React.ReactElement => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [values, setValues] = useState<OwnerValues>({ ...owner, threshold: '' })
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeAddressFromUrl)

  useEffect(
    () => () => {
      setActiveScreen('checkOwner')
    },
    [isOpen],
  )

  const onClickBack = () => {
    if (activeScreen === 'reviewRemoveOwner') {
      setActiveScreen('selectThreshold')
    } else if (activeScreen === 'selectThreshold') {
      setActiveScreen('checkOwner')
    }
  }

  const ownerSubmitted = () => {
    setActiveScreen('selectThreshold')
  }

  const thresholdSubmitted = (newValues) => {
    const cpValues = { ...values, threshold: newValues.threshold }
    setValues(cpValues)
    setActiveScreen('reviewRemoveOwner')
  }

  const onRemoveOwner = (txParameters: TxParameters) => {
    onClose()
    sendRemoveOwner(values, safeAddress, owner.address, owner.name, dispatch, txParameters)
  }

  return (
    <Modal
      description="Remove owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName="bigger-modal-window"
      title="Remove owner from Safe"
    >
      <>
        {activeScreen === 'checkOwner' && <CheckOwner onClose={onClose} onSubmit={ownerSubmitted} owner={owner} />}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm
            onClickBack={onClickBack}
            initialValues={{ threshold: values.threshold }}
            onClose={onClose}
            onSubmit={thresholdSubmitted}
          />
        )}
        {activeScreen === 'reviewRemoveOwner' && (
          <ReviewRemoveOwnerModal
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onRemoveOwner}
            owner={owner}
            threshold={Number(values.threshold)}
          />
        )}
      </>
    </Modal>
  )
}
