import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CheckOwner } from './screens/CheckOwner'
import { ReviewRemoveOwnerModal } from './screens/Review'
import { ThresholdForm } from './screens/ThresholdForm'

import Modal from 'src/components/Modal'
import { SENTINEL_ADDRESS, getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { removeSafeOwner } from 'src/logic/safe/store/actions/removeSafeOwner'
import { safeParamAddressFromStateSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

type OwnerValues = {
  ownerAddress: string
  ownerName: string
  threshold: string
}

export const sendRemoveOwner = async (
  values: OwnerValues,
  safeAddress: string,
  ownerAddressToRemove: string,
  ownerNameToRemove: string,
  dispatch: Dispatch,
  txParameters: TxParameters,
  threshold?: number,
): Promise<void> => {
  const gnosisSafe = getGnosisSafeInstanceAt(safeAddress)
  const safeOwners = await gnosisSafe.methods.getOwners().call()
  const index = safeOwners.findIndex(
    (ownerAddress) => ownerAddress.toLowerCase() === ownerAddressToRemove.toLowerCase(),
  )
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
  const txData = gnosisSafe.methods.removeOwner(prevAddress, ownerAddressToRemove, values.threshold).encodeABI()

  const txHash = await dispatch(
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

  if (txHash && threshold === 1) {
    dispatch(removeSafeOwner({ safeAddress, ownerAddress: ownerAddressToRemove }))
  }
}

type RemoveOwnerProps = {
  isOpen: boolean
  onClose: () => void
  ownerAddress: string
  ownerName: string
}

export const RemoveOwnerModal = ({
  isOpen,
  onClose,
  ownerAddress,
  ownerName,
}: RemoveOwnerProps): React.ReactElement => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [values, setValues] = useState<OwnerValues>({ ownerAddress, ownerName, threshold: '' })
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const threshold = useSelector(safeThresholdSelector) || 1

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
    sendRemoveOwner(values, safeAddress, ownerAddress, ownerName, dispatch, txParameters, threshold)
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
        {activeScreen === 'checkOwner' && (
          <CheckOwner onClose={onClose} onSubmit={ownerSubmitted} ownerAddress={ownerAddress} ownerName={ownerName} />
        )}
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
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            threshold={Number(values.threshold)}
          />
        )}
      </>
    </Modal>
  )
}
