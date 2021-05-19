import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { Mutator } from 'final-form'
import React from 'react'
import { useSelector } from 'react-redux'
import { OnChange } from 'react-final-form-listeners'

import { styles } from './style'

import { getNetworkId } from 'src/config'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import {
  addressIsNotCurrentSafe,
  composeValidators,
  minMaxLength,
  required,
  uniqueAddress,
} from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { addressBookMapSelector } from 'src/logic/addressBook/store/selectors'
import { safeOwnersSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'

import { OwnerValues } from '../..'

export const ADD_OWNER_NAME_INPUT_TEST_ID = 'add-owner-name-input'
export const ADD_OWNER_ADDRESS_INPUT_TEST_ID = 'add-owner-address-testid'
export const ADD_OWNER_NEXT_BTN_TEST_ID = 'add-owner-next-btn'

const formMutators: Record<
  string,
  Mutator<{ setOwnerAddress: { address: string }; setOwnerName: { name: string } }>
> = {
  setOwnerAddress: (args, state, utils) => {
    utils.changeValue(state, 'ownerAddress', () => args[0])
  },
  setOwnerName: (args, state, utils) => {
    utils.changeValue(state, 'ownerName', () => args[0])
  },
}

const useStyles = makeStyles(styles)

const chainId = getNetworkId()

type OwnerFormProps = {
  onClose: () => void
  onSubmit: (values) => void
  initialValues?: OwnerValues
}

export const OwnerForm = ({ onClose, onSubmit, initialValues }: OwnerFormProps): React.ReactElement => {
  const classes = useStyles()
  const handleSubmit = (values) => {
    onSubmit(values)
  }
  const addressBookMap = useSelector(addressBookMapSelector)
  const owners = useSelector(safeOwnersSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const ownerDoesntExist = uniqueAddress(owners)
  const ownerAddressIsNotSafeAddress = addressIsNotCurrentSafe(safeAddress)

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 3</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        formMutators={formMutators}
        initialValues={{
          ownerName: initialValues?.ownerName,
          ownerAddress: initialValues?.ownerAddress,
        }}
        onSubmit={handleSubmit}
      >
        {(...args) => {
          const mutators = args[3]

          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }
            mutators.setOwnerAddress(scannedAddress)
            closeQrModal()
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <Row margin="md">
                  <Paragraph>Add a new owner to the active Safe</Paragraph>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <Field
                      component={TextField}
                      name="ownerName"
                      placeholder="Owner name*"
                      testId={ADD_OWNER_NAME_INPUT_TEST_ID}
                      text="Owner name*"
                      type="text"
                      validate={composeValidators(required, minMaxLength(1, 50))}
                    />
                    <OnChange name="ownerAddress">
                      {async (address: string) => {
                        if (web3ReadOnly.utils.isAddress(address)) {
                          const ownerName = addressBookMap[chainId][address]
                          if (ownerName) {
                            mutators.setOwnerName(ownerName)
                          }
                        }
                      }}
                    </OnChange>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <AddressInput
                      fieldMutator={mutators.setOwnerAddress}
                      name="ownerAddress"
                      placeholder="Owner address*"
                      testId={ADD_OWNER_ADDRESS_INPUT_TEST_ID}
                      text="Owner address*"
                      validators={[ownerDoesntExist, ownerAddressIsNotSafeAddress]}
                    />
                  </Col>
                  <Col center="xs" className={classes} middle="xs" xs={1}>
                    <ScanQRWrapper handleScan={handleScan} />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  minWidth={140}
                  testId={ADD_OWNER_NEXT_BTN_TEST_ID}
                  type="submit"
                  variant="contained"
                >
                  Next
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}
