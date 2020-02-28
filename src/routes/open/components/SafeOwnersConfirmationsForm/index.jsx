// @flow
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import CheckCircle from '@material-ui/icons/CheckCircle'
import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { styles } from './style'
import { getAddressValidator } from './validators'

import QRIcon from '~/assets/icons/qrcode.svg'
import trash from '~/assets/icons/trash.svg'
import ScanQRModal from '~/components/ScanQRModal'
import OpenPaper from '~/components/Stepper/OpenPaper'
import AddressInput from '~/components/forms/AddressInput'
import Field from '~/components/forms/Field'
import SelectField from '~/components/forms/SelectField'
import TextField from '~/components/forms/TextField'
import { composeValidators, minValue, mustBeInteger, noErrorsOn, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import {
  FIELD_CONFIRMATIONS,
  getNumOwnersFrom,
  getOwnerAddressBy,
  getOwnerNameBy,
} from '~/routes/open/components/fields'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'

type Props = {
  classes: Object,
  otherAccounts: string[],
  errors: Object,
  form: Object,
  values: Object,
}

const { useState } = React

export const ADD_OWNER_BUTTON = '+ Add another owner'

export const calculateValuesAfterRemoving = (index: number, notRemovedOwners: number, values: Object) => {
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

const SafeOwners = (props: Props) => {
  const { classes, errors, form, otherAccounts, values } = props

  const validOwners = getNumOwnersFrom(values)

  const [numOwners, setNumOwners] = useState<number>(validOwners)
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)
  const [scanQrForOwnerName, setScanQrForOwnerName] = useState<string | null>(null)

  const openQrModal = ownerName => {
    setScanQrForOwnerName(ownerName)
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const onRemoveRow = (index: number) => () => {
    const initialValues = calculateValuesAfterRemoving(index, numOwners, values)
    form.reset(initialValues)

    setNumOwners(numOwners - 1)
  }

  const onAddOwner = () => {
    setNumOwners(numOwners + 1)
  }

  const handleScan = value => {
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
        <Paragraph color="primary" noMargin size="md">
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

          return (
            <Row className={classes.owner} key={`owner${index}`}>
              <Col className={classes.ownerName} xs={4}>
                <Field
                  className={classes.name}
                  component={TextField}
                  name={getOwnerNameBy(index)}
                  placeholder="Owner Name*"
                  text="Owner Name"
                  type="text"
                  validate={required}
                />
              </Col>
              <Col className={classes.ownerAddress} xs={6}>
                <AddressInput
                  component={TextField}
                  fieldMutator={val => {
                    form.mutators.setValue(addressName, val)
                  }}
                  inputAdornment={
                    noErrorsOn(addressName, errors) && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CheckCircle className={classes.check} />
                        </InputAdornment>
                      ),
                    }
                  }
                  name={addressName}
                  placeholder="Owner Address*"
                  text="Owner Address"
                  type="text"
                  validators={[getAddressValidator(otherAccounts, index)]}
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
                <MenuItem key={`selectOwner${index}`} value={`${index + 1}`}>
                  {index + 1}
                </MenuItem>
              ))}
            </Field>
          </Col>
          <Col className={classes.ownersAmountItem} xs={10}>
            <Paragraph className={classes.owners} color="primary" noMargin size="lg">
              out of {validOwners} owner(s)
            </Paragraph>
          </Col>
        </Row>
      </Block>
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={handleScan} />}
    </>
  )
}

const SafeOwnersForm = withStyles(styles)(withRouter(SafeOwners))

const SafeOwnersPage = ({ updateInitialProps }: Object) => (controls: React.Node, { errors, form, values }: Object) => (
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

export default SafeOwnersPage
