import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import CheckCircle from '@material-ui/icons/CheckCircle'
import * as React from 'react'
import { styles } from './style'
import { getAddressValidator } from './validators'

import QRIcon from 'src/assets/icons/qrcode.svg'
import trash from 'src/assets/icons/trash.svg'
import ScanQRModal from 'src/components/ScanQRModal'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import SelectField from 'src/components/forms/SelectField'
import TextField from 'src/components/forms/TextField'
import {
  composeValidators,
  minValue,
  mustBeInteger,
  noErrorsOn,
  required,
  minMaxLength,
} from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import {
  FIELD_CONFIRMATIONS,
  getNumOwnersFrom,
  getOwnerAddressBy,
  getOwnerNameBy,
} from 'src/routes/open/components/fields'
import { getAccountsFrom } from 'src/routes/open/utils/safeDataExtractor'
import { useSelector } from 'react-redux'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getNameFromAddressBook } from 'src/logic/addressBook/utils'

const { useState } = React

export const ADD_OWNER_BUTTON = '+ Add another owner'

export const calculateValuesAfterRemoving = (index, notRemovedOwners, values) => {
  const initialValues = { ...values }

  const numOwnersAfterRemoving = notRemovedOwners - 1

  for (let i = index; i < numOwnersAfterRemoving; i += 1) {
    initialValues[getOwnerNameBy(i)] = values[getOwnerNameBy(i + 1)]
    initialValues[getOwnerAddressBy(i)] = values[getOwnerAddressBy(i + 1)]
  }

  if (+values[FIELD_CONFIRMATIONS] === notRemovedOwners) {
    initialValues[FIELD_CONFIRMATIONS] = numOwnersAfterRemoving.toString()
  }

  delete initialValues[getOwnerNameBy(index)]
  delete initialValues[getOwnerAddressBy(index)]

  return initialValues
}

const useStyles = makeStyles(styles)

const SafeOwnersForm = (props): React.ReactElement => {
  const { errors, form, otherAccounts, values } = props
  const classes = useStyles()

  const validOwners = getNumOwnersFrom(values)
  const addressBook = useSelector(addressBookSelector)

  const [numOwners, setNumOwners] = useState(validOwners)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [scanQrForOwnerName, setScanQrForOwnerName] = useState(null)

  const openQrModal = (ownerName) => {
    setScanQrForOwnerName(ownerName)
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const onRemoveRow = (index) => () => {
    const initialValues = calculateValuesAfterRemoving(index, numOwners, values)
    form.reset(initialValues)

    setNumOwners(numOwners - 1)
  }

  const onAddOwner = () => {
    setNumOwners(numOwners + 1)
  }

  const handleScan = (value) => {
    let scannedAddress = value

    if (scannedAddress.startsWith('ethereum:')) {
      scannedAddress = scannedAddress.replace('ethereum:', '')
    }

    form.mutators.setValue(scanQrForOwnerName, scannedAddress)
    closeQrModal()
  }

  return (
    <>
      <Block className={classes.title}>
        <Paragraph color="primary" noMargin size="md" data-testid="create-safe-step-two">
          Your Safe will have one or more owners. We have prefilled the first owner with your connected wallet details,
          but you are free to change this to a different owner.
          <br />
          <br />
          Add additional owners (e.g. wallets of your teammates) and specify how many of them have to confirm a
          transaction before it gets executed. In general, the more confirmations required, the more secure is your
          Safe.
        </Paragraph>
      </Block>
      <Hairline />
      <Row className={classes.header}>
        <Col xs={4}>NAME</Col>
        <Col xs={8}>ADDRESS</Col>
      </Row>
      <Hairline />
      <Block margin="md" padding="md">
        {[...Array(Number(numOwners))].map((x, index) => {
          const addressName = getOwnerAddressBy(index)
          const ownerName = getOwnerNameBy(index)

          return (
            <Row className={classes.owner} key={`owner${index}`} data-testid={`create-safe-owner-row`}>
              <Col className={classes.ownerName} xs={4}>
                <Field
                  className={classes.name}
                  component={TextField}
                  name={ownerName}
                  placeholder="Owner Name*"
                  text="Owner Name"
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                  testId={`create-safe-owner-name-field-${index}`}
                />
              </Col>
              <Col className={classes.ownerAddress} xs={6}>
                <AddressInput
                  fieldMutator={(newOwnerAddress) => {
                    const newOwnerName = getNameFromAddressBook(addressBook, newOwnerAddress, {
                      filterOnlyValidName: true,
                    })
                    form.mutators.setValue(addressName, newOwnerAddress)
                    if (newOwnerName) {
                      form.mutators.setValue(ownerName, newOwnerName)
                    }
                  }}
                  // eslint-disable-next-line
                  // @ts-ignore
                  inputAdornment={
                    noErrorsOn(addressName, errors) && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CheckCircle className={classes.check} data-testid={`valid-address-${index}`} />
                        </InputAdornment>
                      ),
                    }
                  }
                  name={addressName}
                  placeholder="Owner Address*"
                  text="Owner Address"
                  validators={[getAddressValidator(otherAccounts, index)]}
                  testId={`create-safe-address-field-${index}`}
                />
              </Col>
              <Col center="xs" className={classes.remove} middle="xs" xs={1}>
                <Img
                  alt="Scan QR"
                  height={20}
                  onClick={() => {
                    openQrModal(addressName)
                  }}
                  src={QRIcon}
                />
              </Col>
              <Col center="xs" className={classes.remove} middle="xs" xs={1}>
                {index > 0 && <Img alt="Delete" height={20} onClick={onRemoveRow(index)} src={trash} />}
              </Col>
            </Row>
          )
        })}
      </Block>
      <Row align="center" className={classes.add} grow margin="xl">
        <Button color="secondary" data-testid="add-owner-btn" onClick={onAddOwner}>
          <Paragraph noMargin size="md">
            {ADD_OWNER_BUTTON}
          </Paragraph>
        </Button>
      </Row>
      <Block className={classes.owner} margin="md" padding="md">
        <Paragraph color="primary" size="md">
          Any transaction requires the confirmation of:
        </Paragraph>
        <Row align="center" className={classes.ownersAmount} margin="xl">
          <Col className={classes.ownersAmountItem} xs={2}>
            <Field
              component={SelectField}
              data-testid="threshold-select-input"
              name={FIELD_CONFIRMATIONS}
              validate={composeValidators(required, mustBeInteger, minValue(1))}
            >
              {[...Array(Number(validOwners))].map((x, index) => (
                <MenuItem key={`selectOwner${index}`} value={`${index + 1}`} data-testid={`input-${index + 1}`}>
                  {index + 1}
                </MenuItem>
              ))}
            </Field>
          </Col>
          <Col className={classes.ownersAmountItem} xs={10}>
            <Paragraph
              className={classes.owners}
              color="primary"
              noMargin
              size="lg"
              data-testid={`create-safe-req-conf-${validOwners}`}
            >
              out of {validOwners} owner(s)
            </Paragraph>
          </Col>
        </Row>
      </Block>
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={handleScan} />}
    </>
  )
}

const SafeOwnersPage = ({ updateInitialProps }) =>
  function OpenSafeOwnersPage(controls, { errors, form, values }) {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <SafeOwnersForm
            errors={errors}
            form={form}
            otherAccounts={getAccountsFrom(values)}
            updateInitialProps={updateInitialProps}
            values={values}
          />
        </OpenPaper>
      </>
    )
  }

export default SafeOwnersPage
