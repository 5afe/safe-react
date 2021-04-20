import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from 'src/components/Modal'
import { addOrUpdateAddressBookEntry } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { addSafeOwner } from 'src/logic/safe/store/actions/addSafeOwner'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

import { OwnerForm } from './screens/OwnerForm'
import { ReviewAddOwner } from './screens/Review'
import { ThresholdForm } from './screens/ThresholdForm'

export type OwnerValues = {
  ownerAddress: string
  ownerName: string
  threshold: string
}

export const sendAddOwner = async (
  values: OwnerValues,
  safeAddress: string,
  txParameters: TxParameters,
  dispatch: Dispatch,
): Promise<void> => {
  const gnosisSafe = getGnosisSafeInstanceAt(safeAddress)
  const txData = gnosisSafe.methods.addOwnerWithThreshold(values.ownerAddress, values.threshold).encodeABI()

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

  if (txHash) {
    dispatch(addSafeOwner({ safeAddress, ownerName: values.ownerName, ownerAddress: values.ownerAddress }))
  }
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const AddOwnerModal = ({ isOpen, onClose }: Props): React.ReactElement => {
  const [activeScreen, setActiveScreen] = useState('selectOwner')
  const [values, setValues] = useState<OwnerValues>({ ownerName: '', ownerAddress: '', threshold: '' })
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  useEffect(
    () => () => {
      setActiveScreen('selectOwner')
      setValues({ ownerName: '', ownerAddress: '', threshold: '' })
    },
    [isOpen],
  )

  const onClickBack = () => {
    if (activeScreen === 'reviewAddOwner') {
      setActiveScreen('selectThreshold')
    } else if (activeScreen === 'selectThreshold') {
      setActiveScreen('selectOwner')
    }
  }

  const ownerSubmitted = (newValues) => {
    setValues((stateValues) => ({
      ...stateValues,
      ownerName: newValues.ownerName,
      ownerAddress: checksumAddress(newValues.ownerAddress),
    }))
    setActiveScreen('selectThreshold')
  }

  const thresholdSubmitted = (newValues) => {
    setValues((stateValues) => ({
      ...stateValues,
      threshold: newValues.threshold,
    }))
    setActiveScreen('reviewAddOwner')
  }

  const onAddOwner = async (txParameters: TxParameters) => {
    onClose()

    try {
      await sendAddOwner(values, safeAddress, txParameters, dispatch)
      dispatch(
        addOrUpdateAddressBookEntry(makeAddressBookEntry({ name: values.ownerName, address: values.ownerAddress })),
      )
    } catch (error) {
      console.error('Error while removing an owner', error)
    }
  }

  return (
    <Modal
      description="Add owner to Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName="bigger-modal-window"
      title="Add owner to Safe"
    >
      <>
        {activeScreen === 'selectOwner' && (
          <OwnerForm initialValues={values} onClose={onClose} onSubmit={ownerSubmitted} />
        )}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm
            onClickBack={onClickBack}
            initialValues={{ threshold: values.threshold }}
            onClose={onClose}
            onSubmit={thresholdSubmitted}
          />
        )}
        {activeScreen === 'reviewAddOwner' && (
          <ReviewAddOwner onClickBack={onClickBack} onClose={onClose} onSubmit={onAddOwner} values={values} />
        )}
      </>
    </Modal>
  )
}
