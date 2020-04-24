// @flow
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import OwnerForm from './screens/OwnerForm'
import ReviewReplaceOwner from './screens/Review'

import Modal from '~/components/Modal'
import { addOrUpdateAddressBookEntry } from '~/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { SENTINEL_ADDRESS, getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import createTransaction from '~/routes/safe/store/actions/createTransaction'
import replaceSafeOwner from '~/routes/safe/store/actions/replaceSafeOwner'
import { safeParamAddressFromStateSelector, safeThresholdSelector } from '~/routes/safe/store/selectors'

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
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  ownerAddress: string,
  ownerName: string,
}
type ActiveScreen = 'checkOwner' | 'reviewReplaceOwner'

export const sendReplaceOwner = async (
  values: Object,
  safeAddress: string,
  ownerAddressToRemove: string,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  threshold: string,
  dispatch: Function,
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

  const txHash = await dispatch(
    createTransaction({
      safeAddress,
      to: safeAddress,
      valueInWei: 0,
      txData,
      notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
      enqueueSnackbar,
      closeSnackbar,
    }),
  )

  if (txHash && threshold === 1) {
    dispatch(
      replaceSafeOwner({
        safeAddress,
        oldOwnerAddress: ownerAddressToRemove,
        ownerAddress: values.ownerAddress,
        ownerName: values.ownerName,
      }),
    )
  }
}

const ReplaceOwner = ({ classes, closeSnackbar, enqueueSnackbar, isOpen, onClose, ownerAddress, ownerName }: Props) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('checkOwner')
  const [values, setValues] = useState<Object>({})
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const threshold = useSelector(safeThresholdSelector)

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
      await sendReplaceOwner(values, safeAddress, ownerAddress, enqueueSnackbar, closeSnackbar, threshold, dispatch)

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
          <OwnerForm onClose={onClose} onSubmit={ownerSubmitted} ownerAddress={ownerAddress} ownerName={ownerName} />
        )}
        {activeScreen === 'reviewReplaceOwner' && (
          <ReviewReplaceOwner
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onReplaceOwner}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            values={values}
          />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(ReplaceOwner))
