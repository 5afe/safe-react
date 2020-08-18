import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import OwnerForm from './screens/OwnerForm'
import ReviewAddOwner from './screens/Review'
import ThresholdForm from './screens/ThresholdForm'

import Modal from 'src/components/Modal'
import { addOrUpdateAddressBookEntry } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import addSafeOwner from 'src/logic/safe/store/actions/addSafeOwner'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'

import { safeOwnersSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    height: 'auto',
  },
})

export const sendAddOwner = async (values, safeAddress, ownersOld, enqueueSnackbar, closeSnackbar, dispatch) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const txData = gnosisSafe.methods.addOwnerWithThreshold(values.ownerAddress, values.threshold).encodeABI()

  const txHash = await dispatch(
    createTransaction({
      safeAddress,
      to: safeAddress,
      valueInWei: '0',
      txData,
      notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
      enqueueSnackbar,
      closeSnackbar,
    } as any),
  )

  if (txHash) {
    dispatch(addSafeOwner({ safeAddress, ownerName: values.ownerName, ownerAddress: values.ownerAddress }))
  }
}

const AddOwner = ({ classes, closeSnackbar, enqueueSnackbar, isOpen, onClose }) => {
  const [activeScreen, setActiveScreen] = useState('selectOwner')
  const [values, setValues] = useState<any>({})
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const owners = useSelector(safeOwnersSelector)

  useEffect(
    () => () => {
      setActiveScreen('selectOwner')
      setValues({})
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

  const onAddOwner = async () => {
    onClose()

    try {
      await sendAddOwner(values, safeAddress, owners, enqueueSnackbar, closeSnackbar, dispatch)
      dispatch(
        addOrUpdateAddressBookEntry(values.ownerAddress, { name: values.ownerName, address: values.ownerAddress }),
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
      paperClassName={classes.biggerModalWindow}
      title="Add owner to Safe"
    >
      <>
        {activeScreen === 'selectOwner' && <OwnerForm onClose={onClose} onSubmit={ownerSubmitted} />}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm onClickBack={onClickBack} onClose={onClose} onSubmit={thresholdSubmitted} />
        )}
        {activeScreen === 'reviewAddOwner' && (
          <ReviewAddOwner onClickBack={onClickBack} onClose={onClose} onSubmit={onAddOwner} values={values} />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles as any)(withSnackbar(AddOwner))
