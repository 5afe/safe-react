// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import CheckCircle from '@material-ui/icons/CheckCircle'
import MenuItem from '@material-ui/core/MenuItem'
import { withRouter } from 'react-router-dom'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import SelectField from '~/components/forms/SelectField'
import AddressInput from '~/components/forms/AddressInput'
import {
  required, composeValidators, noErrorsOn, mustBeInteger, minValue,
} from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Img from '~/components/layout/Img'
import Col from '~/components/layout/Col'
import {
  FIELD_CONFIRMATIONS,
  getOwnerNameBy,
  getOwnerAddressBy,
  getNumOwnersFrom,
} from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Hairline from '~/components/layout/Hairline'
import trash from '~/assets/icons/trash.svg'
import QRIcon from '~/assets/icons/qrcode.svg'
import ScanQRModal from '~/components/ScanQRModal'
import { getAddressValidator } from './validators'
import { styles } from './style'

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
  // muevo indices
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
  const {
    classes, errors, otherAccounts, values, form,
  } = props

  const validOwners = getNumOwnersFrom(values)

  const [numOwners, setNumOwners] = useState<number>(validOwners)
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)
  const [scanQrForOwnerName, setScanQrForOwnerName] = useState<string | null>(null)

  const openQrModal = (ownerName) => {
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
        <Paragraph noMargin size="md" color="primary">
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
            <Row key={`owner${index}`} className={classes.owner}>
              <Col className={classes.ownerName} xs={4}>
                <Field
                  className={classes.name}
                  name={getOwnerNameBy(index)}
                  component={TextField}
                  type="text"
                  validate={required}
                  placeholder="Owner Name*"
                  text="Owner Name"
                />
              </Col>
              <Col className={classes.ownerAddress} xs={6}>
                <AddressInput
                  name={addressName}
                  component={TextField}
                  inputAdornment={
                    noErrorsOn(addressName, errors) && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CheckCircle className={classes.check} />
                        </InputAdornment>
                      ),
                    }
                  }
                  fieldMutator={(val) => {
                    form.mutators.setValue(addressName, val)
                  }}
                  type="text"
                  validators={[getAddressValidator(otherAccounts, index)]}
                  placeholder="Owner Address*"
                  text="Owner Address"
                />
              </Col>
              <Col xs={1} center="xs" middle="xs" className={classes.remove}>
                <Img
                  src={QRIcon}
                  height={20}
                  alt="Scan QR"
                  onClick={() => {
                    openQrModal(addressName)
                  }}
                />
              </Col>
              <Col xs={1} center="xs" middle="xs" className={classes.remove}>
                {index > 0 && <Img src={trash} height={20} alt="Delete" onClick={onRemoveRow(index)} />}
              </Col>
            </Row>
          )
        })}
      </Block>
      <Row align="center" grow className={classes.add} margin="xl">
        <Button color="secondary" onClick={onAddOwner} data-testid="add-owner-btn">
          <Paragraph size="md" noMargin>
            {ADD_OWNER_BUTTON}
          </Paragraph>
        </Button>
      </Row>
      <Block margin="md" padding="md" className={classes.owner}>
        <Paragraph size="md" color="primary">
          Any transaction requires the confirmation of:
        </Paragraph>
        <Row className={classes.ownersAmount} margin="xl" align="center">
          <Col className={classes.ownersAmountItem} xs={2}>
            <Field
              name={FIELD_CONFIRMATIONS}
              component={SelectField}
              validate={composeValidators(required, mustBeInteger, minValue(1))}
              data-testid="threshold-select-input"
            >
              {[...Array(Number(validOwners))].map((x, index) => (
                <MenuItem key={`selectOwner${index}`} value={`${index + 1}`}>
                  {index + 1}
                </MenuItem>
              ))}
            </Field>
          </Col>
          <Col className={classes.ownersAmountItem} xs={10}>
            <Paragraph size="lg" color="primary" noMargin className={classes.owners}>
              out of
              {' '}
              {validOwners}
              {' '}
owner(s)
            </Paragraph>
          </Col>
        </Row>
      </Block>
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onScan={handleScan} onClose={closeQrModal} />}
    </>
  )
}

const SafeOwnersForm = withStyles(styles)(withRouter(SafeOwners))

const SafeOwnersPage = ({ updateInitialProps }: Object) => (controls: React.Node, { values, errors, form }: Object) => (
  <>
    <OpenPaper controls={controls} padding={false}>
      <SafeOwnersForm
        otherAccounts={getAccountsFrom(values)}
        errors={errors}
        form={form}
        updateInitialProps={updateInitialProps}
        values={values}
      />
    </OpenPaper>
  </>
)

export default SafeOwnersPage
