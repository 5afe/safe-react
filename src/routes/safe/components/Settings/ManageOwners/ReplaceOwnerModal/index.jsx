// @flow
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import OwnerForm from './screens/OwnerForm'
import ReviewReplaceOwner from './screens/Review'

import Modal from '~/components/Modal'
import { addOrUpdateAddressBookEntry } from '~/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { SENTINEL_ADDRESS, getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { type Owner } from '~/routes/safe/store/models/owner'
import type { Safe } from '~/routes/safe/store/models/safe'

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
  safe: Safe,
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
  safe: Safe,
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
    replaceSafeOwner({
      safeAddress,
      oldOwnerAddress: ownerAddressToRemove,
      ownerAddress: values.ownerAddress,
      ownerName: values.ownerName,
    })
  }
}

const ReplaceOwner = ({
  classes,
  closeSnackbar,
  createTransaction,
  enqueueSnackbar,
  isOpen,
  onClose,
  ownerAddress,
  ownerName,
  owners,
  replaceSafeOwner,
  safe,
  safeAddress,
  safeName,
  threshold,
}: Props) => {
  const dispatch = useDispatch()
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

  const onReplaceOwner = async () => {
    onClose()

    try {
      await sendReplaceOwner(
        values,
        safeAddress,
        ownerAddress,
        enqueueSnackbar,
        closeSnackbar,
        createTransaction,
        replaceSafeOwner,
        safe,
      )

      dispatch(
        // Needs the `address` field because we need to provide the minimum required values to ADD a new entry
        // The reducer will update all the addressBooks stored, so we cannot decide what to do beforehand,
        // thus, we pass the minimum required fields (name and address)
        addOrUpdateAddressBookEntry(values.ownerAddress, { name: values.ownerName, address: values.ownerAddress }),
      )
    } catch (error) {
      console.error('Error while removing an owner', error)
    }
  }

  return (
    <Modal
      description="Replace owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
      title="Replace owner from Safe"
    >
      <>
        {activeScreen === 'checkOwner' && (
          <OwnerForm
            onClose={onClose}
            onSubmit={ownerSubmitted}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            owners={owners}
          />
        )}
        {activeScreen === 'reviewReplaceOwner' && (
          <ReviewReplaceOwner
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onReplaceOwner}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            owners={owners}
            safeAddress={safeAddress}
            safeName={safeName}
            threshold={threshold}
            values={values}
          />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(ReplaceOwner))
