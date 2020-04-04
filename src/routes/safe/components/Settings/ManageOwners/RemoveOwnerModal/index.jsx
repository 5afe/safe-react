// 
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import CheckOwner from './screens/CheckOwner'
import ReviewRemoveOwner from './screens/Review'
import ThresholdForm from './screens/ThresholdForm'

import Modal from 'components/Modal'
import { SENTINEL_ADDRESS, getGnosisSafeInstanceAt } from 'logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'logic/safe/transactions'
import { } from 'routes/safe/store/models/owner'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    position: 'static',
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
  createTransaction,
  removeSafeOwner,
  safe,
) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const safeOwners = await gnosisSafe.getOwners()
  const index = safeOwners.findIndex(
    (ownerAddress) => ownerAddress.toLowerCase() === ownerAddressToRemove.toLowerCase(),
  )
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
  const txData = gnosisSafe.contract.methods
    .removeOwner(prevAddress, ownerAddressToRemove, values.threshold)
    .encodeABI()

  const txHash = await createTransaction({
    safeAddress,
    to: safeAddress,
    valueInWei: 0,
    txData,
    notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
    enqueueSnackbar,
    closeSnackbar,
  })

  if (txHash && safe.threshold === 1) {
    removeSafeOwner({ safeAddress, ownerAddress: ownerAddressToRemove })
  }
}

const RemoveOwner = ({
  classes,
  closeSnackbar,
  createTransaction,
  enqueueSnackbar,
  isOpen,
  onClose,
  ownerAddress,
  ownerName,
  owners,
  removeSafeOwner,
  safe,
  safeAddress,
  safeName,
  threshold,
}) => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [values, setValues] = useState({})

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
      createTransaction,
      removeSafeOwner,
      safe,
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
          <ThresholdForm
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={thresholdSubmitted}
            owners={owners}
            threshold={threshold}
          />
        )}
        {activeScreen === 'reviewRemoveOwner' && (
          <ReviewRemoveOwner
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onRemoveOwner}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            owners={owners}
            safeAddress={safeAddress}
            safeName={safeName}
            values={values}
          />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(RemoveOwner))
