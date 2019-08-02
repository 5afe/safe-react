// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Modal from '~/components/Modal'
import { type Owner } from '~/routes/safe/store/models/owner'
import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from '~/logic/contracts/safeContracts'
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
  network: string,
  createTransaction: Function,
  removeSafeOwner: Function,
}
type ActiveScreen = 'checkOwner' | 'selectThreshold' | 'reviewRemoveOwner'

export const sendRemoveOwner = async (
  values: Object,
  safeAddress: string,
  ownerAddressToRemove: string,
  ownerNameToRemove: string,
  ownersOld: List<Owner>,
  createTransaction: Function,
  removeSafeOwner: Function,
) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const safeOwners = await gnosisSafe.getOwners()
  const index = safeOwners.findIndex(ownerAddress => ownerAddress.toLowerCase() === ownerAddressToRemove.toLowerCase())
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
  const txData = gnosisSafe.contract.methods
    .removeOwner(prevAddress, ownerAddressToRemove, values.threshold)
    .encodeABI()

  const txHash = await createTransaction(safeAddress, safeAddress, 0, txData)

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
  network,
  createTransaction,
  removeSafeOwner,
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
    try {
      sendRemoveOwner(values, safeAddress, ownerAddress, ownerName, owners, createTransaction, removeSafeOwner)
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while removing an owner ' + error)
    }
  }

  return (
    <Modal
      title="Remove owner from Safe"
      description="Remove owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
    >
      <React.Fragment>
        {activeScreen === 'checkOwner' && (
          <CheckOwner
            onClose={onClose}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            network={network}
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
            network={network}
            values={values}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            onClickBack={onClickBack}
            onSubmit={onRemoveOwner}
          />
        )}
      </React.Fragment>
    </Modal>
  )
}

export default withStyles(styles)(RemoveOwner)
