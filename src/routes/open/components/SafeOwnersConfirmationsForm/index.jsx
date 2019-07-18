// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import CheckCircle from '@material-ui/icons/CheckCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import SelectField from '~/components/forms/SelectField'
import {
  required, composeValidators, noErrorsOn, mustBeInteger, minValue,
} from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Img from '~/components/layout/Img'
import Col from '~/components/layout/Col'
import { FIELD_CONFIRMATIONS, getOwnerNameBy, getOwnerAddressBy, getNumOwnersFrom } from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Hairline from '~/components/layout/Hairline'
import trash from '~/assets/icons/trash.svg'
import { getAddressValidators } from './validators'
import { styles } from './style'

type Props = {
  classes: Object,
  otherAccounts: string[],
  errors: Object,
  values: Object,
  updateInitialProps: (initialValues: Object) => void,
}

const { useState } = React

export const ADD_OWNER_BUTTON = '+ ADD ANOTHER OWNER'

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

  delete initialValues[getOwnerNameBy(numOwnersAfterRemoving)]
  delete initialValues[getOwnerAddressBy(numOwnersAfterRemoving)]

  return initialValues
}

const SafeOwners = (props: Props) => {
  const {
    classes, errors, otherAccounts, values, updateInitialProps,
  } = props
  const [numOwners, setNumOwners] = useState<number>(1)
  const validOwners = getNumOwnersFrom(values)

  const onRemoveRow = (index: number) => () => {
    const initialValues = calculateValuesAfterRemoving(index, numOwners, values)
    console.log({ initialValues })
    updateInitialProps(initialValues)

    setNumOwners(numOwners - 1)
  }
  console.log('values in form', { values })

  const onAddOwner = () => {
    setNumOwners(numOwners + 1)
  }

  return (
    <React.Fragment>
      <Block className={classes.title}>
        <Paragraph noMargin size="md" color="primary">
          Specify the owners of the Safe.
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
              <Col xs={4}>
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
              <Col xs={7}>
                <Field
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
                  type="text"
                  validate={getAddressValidators(otherAccounts, index)}
                  placeholder="Owner Address*"
                  text="Owner Address"
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
          <Paragraph weight="bold" size="md" noMargin>
            {ADD_OWNER_BUTTON}
          </Paragraph>
        </Button>
      </Row>
      <Block margin="md" padding="md" className={classes.owner}>
        <Paragraph noMargin size="md" color="primary" weight="bolder">
          Any transaction requires the confirmation of:
        </Paragraph>
        <Row margin="xl" align="center">
          <Col xs={2}>
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
          <Col xs={10}>
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
    </React.Fragment>
  )
}

const SafeOwnersForm = withStyles(styles)(SafeOwners)

const SafeOwnersPage = ({ updateInitialProps }: Object) => (controls: React.Node, { values, errors }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} padding={false}>
      <SafeOwnersForm
        otherAccounts={getAccountsFrom(values)}
        errors={errors}
        updateInitialProps={updateInitialProps}
        values={values}
        />
        {console.log('vals one level up', values)}
    </OpenPaper>
  </React.Fragment>
)

export default SafeOwnersPage
