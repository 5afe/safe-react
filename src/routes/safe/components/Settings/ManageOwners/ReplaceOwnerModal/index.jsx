// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import { SharedSnackbarConsumer } from '~/components/SharedSnackBar'
import Modal from '~/components/Modal'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import OwnerForm from './screens/OwnerForm'
import ReviewReplaceOwner from './screens/Review'

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
  network: string,
  threshold: string,
  createTransaction: Function,
  replaceSafeOwner: Function,
}
type ActiveScreen = 'checkOwner' | 'reviewReplaceOwner'

const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

export const sendReplaceOwner = async (
  values: Object,
  safeAddress: string,
  ownerAddressToRemove: string,
  ownerNameToRemove: string,
  ownersOld: List<Owner>,
  openSnackbar: Function,
  createTransaction: Function,
  replaceSafeOwner: Function,
) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const safeOwners = await gnosisSafe.getOwners()
  const index = safeOwners.findIndex(ownerAddress => ownerAddress.toLowerCase() === ownerAddressToRemove.toLowerCase())
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
  const txData = gnosisSafe.contract.methods
    .swapOwner(prevAddress, ownerAddressToRemove, values.ownerAddress)
    .encodeABI()

  const txHash = await createTransaction(safeAddress, safeAddress, 0, txData, openSnackbar)

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
  network,
  threshold,
  createTransaction,
  replaceSafeOwner,
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

  return (
    <React.Fragment>
      <SharedSnackbarConsumer>
        {({ openSnackbar }) => {
          const onReplaceOwner = () => {
            onClose()
            try {
              sendReplaceOwner(
                values,
                safeAddress,
                ownerAddress,
                ownerName,
                owners,
                openSnackbar,
                createTransaction,
                replaceSafeOwner,
              )
            } catch (error) {
              // eslint-disable-next-line
              console.log('Error while removing an owner ' + error)
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
              <React.Fragment>
                {activeScreen === 'checkOwner' && (
                  <OwnerForm
                    onClose={onClose}
                    ownerAddress={ownerAddress}
                    ownerName={ownerName}
                    owners={owners}
                    network={network}
                    onSubmit={ownerSubmitted}
                  />
                )}
                {activeScreen === 'reviewReplaceOwner' && (
                  <ReviewReplaceOwner
                    onClose={onClose}
                    safeName={safeName}
                    owners={owners}
                    network={network}
                    values={values}
                    ownerAddress={ownerAddress}
                    ownerName={ownerName}
                    onClickBack={onClickBack}
                    onSubmit={onReplaceOwner}
                    threshold={threshold}
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

export default withStyles(styles)(ReplaceOwner)
