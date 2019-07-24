// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Modal from '~/components/Modal'
import { type Owner } from '~/routes/safe/store/models/owner'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import OwnerForm from './screens/OwnerForm'
import ThresholdForm from './screens/ThresholdForm'
import ReviewAddOwner from './screens/Review'

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
  owners: List<Owner>,
  threshold: number,
  network: string,
  addSafeOwner: Function,
  createTransaction: Function,
}
type ActiveScreen = 'selectOwner' | 'selectThreshold' | 'reviewAddOwner'

export const sendAddOwner = async (
  values: Object,
  safeAddress: string,
  ownersOld: List<Owner>,
  createTransaction: Function,
  addSafeOwner: Function,
) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const txData = gnosisSafe.contract.methods.addOwnerWithThreshold(values.ownerAddress, values.threshold).encodeABI()

  const txHash = await createTransaction(safeAddress, safeAddress, 0, txData)

  if (txHash) {
    addSafeOwner({ safeAddress, ownerName: values.ownerName, ownerAddress: values.ownerAddress })
  }
}

const AddOwner = ({
  onClose,
  isOpen,
  classes,
  safeAddress,
  safeName,
  owners,
  threshold,
  network,
  createTransaction,
  addSafeOwner,
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
    setValues(stateValues => ({
      ...stateValues,
      ownerName: newValues.ownerName,
      ownerAddress: newValues.ownerAddress,
    }))
    setActiveScreen('selectThreshold')
  }

  const thresholdSubmitted = (newValues: Object) => {
    setValues(stateValues => ({
      ...stateValues,
      threshold: newValues.threshold,
    }))
    setActiveScreen('reviewAddOwner')
  }

  const onAddOwner = async () => {
    onClose()
    try {
      sendAddOwner(values, safeAddress, owners, createTransaction, addSafeOwner)
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while removing an owner ' + error)
    }
  }

  return (
    <Modal
      title="Add owner to Safe"
      description="Add owner to Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
    >
      <React.Fragment>
        {activeScreen === 'selectOwner' && <OwnerForm onClose={onClose} onSubmit={ownerSubmitted} owners={owners} />}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm
            onClose={onClose}
            owners={owners}
            threshold={threshold}
            onClickBack={onClickBack}
            onSubmit={thresholdSubmitted}
          />
        )}
        {activeScreen === 'reviewAddOwner' && (
          <ReviewAddOwner
            onClose={onClose}
            safeName={safeName}
            owners={owners}
            network={network}
            values={values}
            onClickBack={onClickBack}
            onSubmit={onAddOwner}
          />
        )}
      </React.Fragment>
    </Modal>
  )
}

export default withStyles(styles)(AddOwner)
