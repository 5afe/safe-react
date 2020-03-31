// @flow
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import OwnerForm from './screens/OwnerForm'
import ReviewAddOwner from './screens/Review'
import ThresholdForm from './screens/ThresholdForm'

import Modal from '~/components/Modal'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { type Owner } from '~/routes/safe/store/models/owner'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    position: 'static',
    height: 'auto',
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  safeAddress: string,
  safeName: string,
  owners: List<Owner>,
  threshold: number,
  addSafeOwner: Function,
  createTransaction: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}
type ActiveScreen = 'selectOwner' | 'selectThreshold' | 'reviewAddOwner'

export const sendAddOwner = async (
  values: Object,
  safeAddress: string,
  ownersOld: List<Owner>,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  createTransaction: Function,
  addSafeOwner: Function,
) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const txData = gnosisSafe.contract.methods.addOwnerWithThreshold(values.ownerAddress, values.threshold).encodeABI()

  const txHash = await createTransaction({
    safeAddress,
    to: safeAddress,
    valueInWei: 0,
    txData,
    notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
    enqueueSnackbar,
    closeSnackbar,
  })

  if (txHash) {
    addSafeOwner({ safeAddress, ownerName: values.ownerName, ownerAddress: values.ownerAddress })
  }
}

const AddOwner = ({
  addSafeOwner,
  classes,
  closeSnackbar,
  createTransaction,
  enqueueSnackbar,
  isOpen,
  onClose,
  owners,
  safeAddress,
  safeName,
  threshold,
}: Props) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('selectOwner')
  const [values, setValues] = useState<Object>({})

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

  const ownerSubmitted = (newValues: Object) => {
    setValues((stateValues) => ({
      ...stateValues,
      ownerName: newValues.ownerName,
      ownerAddress: newValues.ownerAddress,
    }))
    setActiveScreen('selectThreshold')
  }

  const thresholdSubmitted = (newValues: Object) => {
    setValues((stateValues) => ({
      ...stateValues,
      threshold: newValues.threshold,
    }))
    setActiveScreen('reviewAddOwner')
  }

  const onAddOwner = async () => {
    onClose()
    try {
      sendAddOwner(values, safeAddress, owners, enqueueSnackbar, closeSnackbar, createTransaction, addSafeOwner)
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
        {activeScreen === 'selectOwner' && <OwnerForm onClose={onClose} onSubmit={ownerSubmitted} owners={owners} />}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={thresholdSubmitted}
            owners={owners}
            threshold={threshold}
          />
        )}
        {activeScreen === 'reviewAddOwner' && (
          <ReviewAddOwner
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onAddOwner}
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

export default withStyles(styles)(withSnackbar(AddOwner))
