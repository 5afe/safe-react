// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import {
  required,
  composeValidators,
  uniqueAddress,
  mustBeEthereumAddress,
  noErrorsOn,
} from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Img from '~/components/layout/Img'
import Col from '~/components/layout/Col'
import { getOwnerNameBy, getOwnerAddressBy } from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Hairline from '~/components/layout/Hairline'
import { md, lg, sm } from '~/theme/variables'
import trash from '~/assets/icons/trash.svg'

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
  remove: {
    height: '56px',
    marginTop: '12px',
    maxWidth: '50px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

const getAddressValidators = (addresses: string[], position: number) => {
  const copy = addresses.slice()
  copy.splice(position, 1)

  return composeValidators(required, mustBeEthereumAddress, uniqueAddress(copy))
}

export const ADD_OWNER_BUTTON = '+ ADD ANOTHER OWNER'

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
    numOwners: 1,
  }

  onRemoveRow = (index: number) => () => {
    const { values, updateInitialProps } = this.props
    const { numOwners } = this.state
    const initialValues = calculateValuesAfterRemoving(index, numOwners, values)
    updateInitialProps(initialValues)

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
                  {index > 0 && <Img src={trash} height={20} alt="Delete" onClick={this.onRemoveRow(index)} />}
                </Col>
              </Row>
            )
          })}
        </Block>
        <Row align="center" grow className={classes.add} margin="xl">
          <Button color="secondary" onClick={this.onAddOwner} data-testid="add-owner-btn">
            <Paragraph weight="bold" size="md" noMargin>
              {ADD_OWNER_BUTTON}
            </Paragraph>
          </Button>
        </Row>
      </React.Fragment>
    )
  }
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
    </OpenPaper>
  </React.Fragment>
)

export default SafeOwnersPage
