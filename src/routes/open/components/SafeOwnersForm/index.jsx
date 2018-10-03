// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required, composeValidators, uniqueAddress, mustBeEthereumAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import InputAdornment from '@material-ui/core/InputAdornment'
import CheckCircle from '@material-ui/icons/CheckCircle'
import { getOwnerNameBy, getOwnerAddressBy } from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Hairline from '~/components/layout/Hairline'
import { md, lg, sm } from '~/theme/variables'

type Props = {
  classes: Object,
  otherAccounts: string[],
  errors: Object,
  values: Object,
  updateInitialProps: (initialValues: Object) => void,
}

type State = {
  numOwners: number,
}

const styles = () => ({
  root: {
    display: 'flex',
  },
  title: {
    padding: `${md} ${lg}`,
  },
  owner: {
    padding: `0 ${lg}`,
  },
  header: {
    padding: `${sm} ${lg}`,
  },
  name: {
    marginRight: `${sm}`,
  },
  trash: {
    top: '5px',
  },
  add: {
    justifyContent: 'center',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
})

const getAddressValidators = (addresses: string[], position: number) => {
  const copy = addresses.slice()
  copy.splice(position, 1)

  return composeValidators(required, mustBeEthereumAddress, uniqueAddress(copy))
}

const noErrorsOn = (name: string, errors: Object) => errors[name] === undefined

export const calculateValuesAfterRemoving = (index: number, notRemovedOwners: number, values: Object) => {
  const initialValues = { ...values }
  const numOwnersAfterRemoving = notRemovedOwners - 1
  // muevo indices
  for (let i = index; i < numOwnersAfterRemoving; i += 1) {
    initialValues[getOwnerNameBy(i)] = values[getOwnerNameBy(i + 1)]
    initialValues[getOwnerAddressBy(i)] = values[getOwnerAddressBy(i + 1)]
  }

  delete initialValues[getOwnerNameBy(numOwnersAfterRemoving)]
  delete initialValues[getOwnerAddressBy(numOwnersAfterRemoving)]

  return initialValues
}

class SafeOwners extends React.Component<Props, State> {
  state = {
    numOwners: 3,
  }

  onRemoveRow = (index: number) => () => {
    const { values } = this.props
    const { numOwners } = this.state
    const initialValues = calculateValuesAfterRemoving(index, numOwners, values)
    this.props.updateInitialProps(initialValues)


    this.setState(state => ({
      numOwners: state.numOwners - 1,
    }))
  }

  onAddOwner = () => {
    this.setState(state => ({
      numOwners: state.numOwners + 1,
    }))
  }

  render() {
    const { classes, errors, otherAccounts } = this.props
    const { numOwners } = this.state

    return (
      <React.Fragment>
        <Block className={classes.title}>
          <Paragraph noMargin size="md" color="primary" weight="light">
            Specify the owners of the Safe.
          </Paragraph>
        </Block>
        <Hairline />
        <Row className={classes.header}>
          <Col xs={4}>NAME</Col>
          <Col xs={8}>ADDRESS</Col>
        </Row>
        <Hairline />
        <Block margin="md">
          { [...Array(Number(numOwners))].map((x, index) => {
            const addressName = getOwnerAddressBy(index)

            return (
              <Row key={`owner${(index)}`} className={classes.owner}>
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
                    inputAdornment={noErrorsOn(addressName, errors) && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CheckCircle className={classes.check} />
                        </InputAdornment>
                      ),
                    }}
                    type="text"
                    validate={getAddressValidators(otherAccounts, index)}
                    placeholder="Owner Address*"
                    text="Owner Address"
                  />
                </Col>
                <Col xs={1} center="xs" middle="xs">
                  { index > 0 &&
                    <IconButton aria-label="Delete" onClick={this.onRemoveRow(index)} className={classes.trash}>
                      <Delete />
                    </IconButton>
                  }
                </Col>
              </Row>
            )
          }) }
        </Block>
        <Row align="center" grow className={classes.add} margin="xl">
          <Button color="secondary" onClick={this.onAddOwner}>
            + ADD ANOTHER OWNER
          </Button>
        </Row>
      </React.Fragment>
    )
  }
}

const SafeOwnersForm = withStyles(styles)(SafeOwners)

const SafeOwnersPage = ({ updateInitialProps }: Object) => (controls: React$Node, { values, errors }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} padding={false}>
      <SafeOwnersForm
        otherAccounts={getAccountsFrom(values)}
        errors={errors}
        updateInitialProps={updateInitialProps}
        values={values}
      />
    </OpenPaper>
  </React.Fragment>
)


export default SafeOwnersPage
