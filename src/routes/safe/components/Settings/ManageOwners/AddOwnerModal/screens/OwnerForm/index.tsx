import { makeStyles } from '@material-ui/core/styles'
import { Mutator } from 'final-form'

import { useSelector } from 'react-redux'
import { OnChange } from 'react-final-form-listeners'

import { styles } from './style'

import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import {
  addressIsNotCurrentSafe,
  composeValidators,
  required,
  uniqueAddress,
  validAddressBookName,
} from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { isValidAddress } from 'src/utils/isValidAddress'

import { OwnerValues } from '../..'
import { Modal } from 'src/components/Modal'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

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
  const addressBookMap = useSelector(currentNetworkAddressBookAsMap)
  const { address: safeAddress = '', owners = [] } = useSelector(currentSafe) ?? {}
  const ownerDoesntExist = uniqueAddress(owners)
  const ownerAddressIsNotSafeAddress = addressIsNotCurrentSafe(safeAddress)

  return (
    <>
      <ModalHeader onClose={onClose} title="Add new owner" subTitle={getStepTitle(1, 3)} />
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
                      label="Owner name*"
                      type="text"
                      validate={composeValidators(required, validAddressBookName)}
                    />
                    <OnChange name="ownerAddress">
                      {async (address: string) => {
                        if (isValidAddress(address)) {
                          const ownerName = addressBookMap[address]?.name
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
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose, text: 'Cancel' }}
                  confirmButtonProps={{
                    type: 'submit',
                    text: 'Next',
                    testId: ADD_OWNER_NEXT_BTN_TEST_ID,
                  }}
                />
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}
