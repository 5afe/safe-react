// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import { SharedSnackbarConsumer } from '~/components/SharedSnackBar'
import Modal from '~/components/Modal'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type Owner, makeOwner } from '~/routes/safe/store/models/owner'
import { setOwners } from '~/logic/safe/utils'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import OwnerForm from './screens/OwnerForm'
import ThresholdForm from './screens/ThresholdForm'
import ReviewAddOwner from './screens/Review'
import { withStyles } from '@material-ui/core/styles'

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
  userAddress: string,
  createTransaction: Function,
}
type ActiveScreen = 'selectOwner' | 'selectThreshold' | 'reviewAddOwner'

export const sendAddOwner = async (
  values: Object,
  safeAddress: string,
  owners: List<Owner>,
  openSnackbar: Fuction,
  createTransaction: Function,
) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const txData = gnosisSafe.contract.methods.addOwnerWithThreshold(values.ownerAddress, values.threshold).encodeABI()

  const txHash = await createTransaction(safeAddress, safeAddress, 0, txData, openSnackbar)
  if (txHash) {
    setOwners(safeAddress, owners.push(makeOwner({ name: values.ownerName, address: values.ownerAddress })))
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
  userAddress,
  createTransaction,
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
    values.ownerName = newValues.ownerName
    values.ownerAddress = newValues.ownerAddress
    setValues(values)
    setActiveScreen('selectThreshold')
  }

  const thresholdSubmitted = (newValues: Object) => {
    values.threshold = newValues.threshold
    setValues(values)
    setActiveScreen('reviewAddOwner')
  }

  return (
    <React.Fragment>
      <SharedSnackbarConsumer>
        {({ openSnackbar }) => {
          const onAddOwner = async () => {
            onClose()
            try {
              sendAddOwner(values, safeAddress, owners, openSnackbar, createTransaction)
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
                {activeScreen === 'selectOwner' && (
                  <OwnerForm
                    onClose={onClose}
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
        }}
      </SharedSnackbarConsumer>
    </React.Fragment>
  )
}

export default withStyles(styles)(AddOwner)
