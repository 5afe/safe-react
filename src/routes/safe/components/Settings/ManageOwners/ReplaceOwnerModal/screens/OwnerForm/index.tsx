import { Mutator } from 'final-form'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { OnChange } from 'react-final-form-listeners'

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
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { Modal } from 'src/components/Modal'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'
import { isValidAddress } from 'src/utils/isValidAddress'

import { useStyles } from './style'
import { getExplorerInfo } from 'src/config'

export const REPLACE_OWNER_NAME_INPUT_TEST_ID = 'replace-owner-name-input'
export const REPLACE_OWNER_ADDRESS_INPUT_TEST_ID = 'replace-owner-address-testid'
export const REPLACE_OWNER_NEXT_BTN_TEST_ID = 'replace-owner-next-btn'

import { OwnerValues } from '../..'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

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

type NewOwnerProps = {
  ownerAddress: string
  ownerName: string
}

type OwnerFormProps = {
  onClose: () => void
  onSubmit: (values: NewOwnerProps) => void
  owner: OwnerData
  initialValues?: OwnerValues
}

export const OwnerForm = ({ onClose, onSubmit, owner, initialValues }: OwnerFormProps): ReactElement => {
  const classes = useStyles()

  const handleSubmit = (values: NewOwnerProps) => {
    onSubmit(values)
  }
  const addressBookMap = useSelector(currentNetworkAddressBookAsMap)
  const { address: safeAddress = '', owners } = useSelector(currentSafe) ?? {}
  const ownerDoesntExist = uniqueAddress(owners)
  const ownerAddressIsNotSafeAddress = addressIsNotCurrentSafe(safeAddress)

  return (
    <>
      <ModalHeader onClose={onClose} title="Replace owner" subTitle={getStepTitle(1, 2)} />
      <Hairline />
      <GnoForm
        formMutators={formMutators}
        onSubmit={handleSubmit}
        initialValues={{
          ownerName: initialValues?.name,
          ownerAddress: initialValues?.address,
        }}
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
                <Row>
                  <Paragraph>
                    Review the owner you want to replace from the active Safe. Then specify the new owner you want to
                    replace it with:
                  </Paragraph>
                </Row>
                <Row>
                  <Paragraph>Current owner</Paragraph>
                </Row>
                <Row className={classes.owner}>
                  <Col align="center" xs={12}>
                    <PrefixedEthHashInfo
                      hash={owner.address}
                      name={owner.name}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(owner.address)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Paragraph>New owner</Paragraph>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <Field
                      component={TextField}
                      name="ownerName"
                      placeholder="Owner name*"
                      testId={REPLACE_OWNER_NAME_INPUT_TEST_ID}
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
                      testId={REPLACE_OWNER_ADDRESS_INPUT_TEST_ID}
                      text="Owner address*"
                      validators={[ownerDoesntExist, ownerAddressIsNotSafeAddress]}
                    />
                  </Col>
                  <Col center="xs" className={classes} middle="xs" xs={1}>
                    <ScanQRWrapper handleScan={handleScan} />
                  </Col>
                </Row>
              </Block>
              <Modal.Footer>
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{ testId: REPLACE_OWNER_NEXT_BTN_TEST_ID, text: 'Next' }}
                />
              </Modal.Footer>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}
