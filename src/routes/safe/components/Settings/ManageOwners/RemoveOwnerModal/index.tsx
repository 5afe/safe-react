import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CheckOwner from './screens/CheckOwner'
import ReviewRemoveOwner from './screens/Review'
import ThresholdForm from './screens/ThresholdForm'

import Modal from 'src/components/Modal'
import { SENTINEL_ADDRESS, getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import removeSafeOwner from 'src/logic/safe/store/actions/removeSafeOwner'

import {
  safeOwnersSelector,
  safeParamAddressFromStateSelector,
  safeThresholdSelector,
} from 'src/logic/safe/store/selectors'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    height: 'auto',
  },
})

export const sendRemoveOwner = async (
  values,
  safeAddress,
  ownerAddressToRemove,
  ownerNameToRemove,
  ownersOld,
  enqueueSnackbar,
  closeSnackbar,
  threshold,
  dispatch,
) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
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
      notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
      enqueueSnackbar,
      closeSnackbar,
    } as any),
  )

  if (txHash && threshold === 1) {
    dispatch(removeSafeOwner({ safeAddress, ownerAddress: ownerAddressToRemove }))
  }
}

const RemoveOwner = ({ classes, closeSnackbar, enqueueSnackbar, isOpen, onClose, ownerAddress, ownerName }) => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [values, setValues] = useState<any>({})
  const dispatch = useDispatch()
  const owners = useSelector(safeOwnersSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const threshold = useSelector(safeThresholdSelector)

  useEffect(
    () => () => {
      setActiveScreen('checkOwner')
      setValues({})
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
    values.threshold = newValues.threshold
    setValues(values)
    setActiveScreen('reviewRemoveOwner')
  }

  const onRemoveOwner = () => {
    onClose()
    sendRemoveOwner(
      values,
      safeAddress,
      ownerAddress,
      ownerName,
      owners,
      enqueueSnackbar,
      closeSnackbar,
      threshold,
      dispatch,
    )
  }

  return (
    <Modal
      description="Remove owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
      title="Remove owner from Safe"
    >
      <>
        {activeScreen === 'checkOwner' && (
          <CheckOwner onClose={onClose} onSubmit={ownerSubmitted} ownerAddress={ownerAddress} ownerName={ownerName} />
        )}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm onClickBack={onClickBack} onClose={onClose} onSubmit={thresholdSubmitted} />
        )}
        {activeScreen === 'reviewRemoveOwner' && (
          <ReviewRemoveOwner
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onRemoveOwner}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            values={values}
          />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles as any)(withSnackbar(RemoveOwner))
