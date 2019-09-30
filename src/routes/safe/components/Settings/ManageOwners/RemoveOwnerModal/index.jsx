// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import Modal from '~/components/Modal'
import { type Owner } from '~/routes/safe/store/models/owner'
import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from '~/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import CheckOwner from './screens/CheckOwner'
import ThresholdForm from './screens/ThresholdForm'
import ReviewRemoveOwner from './screens/Review'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    position: 'static',
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  safeAddress: string,
  safeName: string,
  ownerAddress: string,
  ownerName: string,
  owners: List<Owner>,
  threshold: number,
  createTransaction: Function,
  removeSafeOwner: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

type ActiveScreen = 'checkOwner' | 'selectThreshold' | 'reviewRemoveOwner'

export const sendRemoveOwner = async (
  values: Object,
  safeAddress: string,
  ownerAddressToRemove: string,
  ownerNameToRemove: string,
  ownersOld: List<Owner>,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  createTransaction: Function,
  removeSafeOwner: Function,
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

  const txHash = await createTransaction(
    safeAddress,
    safeAddress,
    0,
    txData,
    TX_NOTIFICATION_TYPES.OWNER_CHANGE_TX,
    enqueueSnackbar,
    closeSnackbar,
  )

  if (txHash) {
    removeSafeOwner({ safeAddress, ownerAddress: ownerAddressToRemove })
  }
}

const RemoveOwner = ({
  onClose,
  isOpen,
  classes,
  safeAddress,
  safeName,
  ownerAddress,
  ownerName,
  owners,
  threshold,
  createTransaction,
  removeSafeOwner,
  enqueueSnackbar,
  closeSnackbar,
}: Props) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('checkOwner')
  const [values, setValues] = useState<Object>({})

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

  const thresholdSubmitted = (newValues: Object) => {
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
    )
  }

  return (
    <Modal
      title="Remove owner from Safe"
      description="Remove owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
    >
      <>
        {activeScreen === 'checkOwner' && (
          <CheckOwner
            onClose={onClose}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            onSubmit={ownerSubmitted}
          />
        )}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm
            onClose={onClose}
            owners={owners}
            threshold={threshold}
            onClickBack={onClickBack}
            onSubmit={thresholdSubmitted}
          />
        )}
        {activeScreen === 'reviewRemoveOwner' && (
          <ReviewRemoveOwner
            onClose={onClose}
            safeName={safeName}
            owners={owners}
            values={values}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            onClickBack={onClickBack}
            onSubmit={onRemoveOwner}
          />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(RemoveOwner))
