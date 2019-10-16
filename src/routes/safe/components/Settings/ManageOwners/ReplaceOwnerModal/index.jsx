// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import Modal from '~/components/Modal'
import { type Owner } from '~/routes/safe/store/models/owner'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from '~/logic/contracts/safeContracts'
import OwnerForm from './screens/OwnerForm'
import ReviewReplaceOwner from './screens/Review'

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
  ownerAddress: string,
  ownerName: string,
  owners: List<Owner>,
  threshold: string,
  createTransaction: Function,
  replaceSafeOwner: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}
type ActiveScreen = 'checkOwner' | 'reviewReplaceOwner'

export const sendReplaceOwner = async (
  values: Object,
  safeAddress: string,
  ownerAddressToRemove: string,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  createTransaction: Function,
  replaceSafeOwner: Function,
) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const safeOwners = await gnosisSafe.getOwners()
  const index = safeOwners.findIndex(
    (ownerAddress) => ownerAddress.toLowerCase() === ownerAddressToRemove.toLowerCase(),
  )
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
  const txData = gnosisSafe.contract.methods
    .swapOwner(prevAddress, ownerAddressToRemove, values.ownerAddress)
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
    replaceSafeOwner({
      safeAddress,
      oldOwnerAddress: ownerAddressToRemove,
      ownerAddress: values.ownerAddress,
      ownerName: values.ownerName,
    })
  }
}

const ReplaceOwner = ({
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
  replaceSafeOwner,
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

  const onClickBack = () => setActiveScreen('checkOwner')

  const ownerSubmitted = (newValues: Object) => {
    values.ownerName = newValues.ownerName
    values.ownerAddress = newValues.ownerAddress
    setValues(values)
    setActiveScreen('reviewReplaceOwner')
  }

  const onReplaceOwner = () => {
    onClose()
    try {
      sendReplaceOwner(
        values,
        safeAddress,
        ownerAddress,
        enqueueSnackbar,
        closeSnackbar,
        createTransaction,
        replaceSafeOwner,
      )
    } catch (error) {
      console.error('Error while removing an owner', error)
    }
  }

  return (
    <Modal
      title="Replace owner from Safe"
      description="Replace owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
    >
      <>
        {activeScreen === 'checkOwner' && (
          <OwnerForm
            onClose={onClose}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            owners={owners}
            onSubmit={ownerSubmitted}
          />
        )}
        {activeScreen === 'reviewReplaceOwner' && (
          <ReviewReplaceOwner
            onClose={onClose}
            safeName={safeName}
            owners={owners}
            values={values}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            onClickBack={onClickBack}
            onSubmit={onReplaceOwner}
            threshold={threshold}
            safeAddress={safeAddress}
          />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(ReplaceOwner))
