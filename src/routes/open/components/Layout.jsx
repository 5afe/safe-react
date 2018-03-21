// @flow
import Button from 'material-ui/Button'
import * as React from 'react'
<<<<<<< bc66e1af90d0700b6fe584e60d482ee73c85e77e
import { Field } from 'react-final-form'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
=======
import { Form, Field } from 'react-final-form'
import Block from '~/components/layout/Block'
>>>>>>> WA-229 Fix auto layout center in PageFrame
import TextField from '~/components/forms/TextField'
import GnoForm from '~/components/forms/GnoForm'
import Name from './Name'
import Owners from './Owners'
import Confirmations from './Confirmations'

type Props = {
  onCallSafeContractSubmit: Function,
  onAddFunds: Function,
  safeAddress: string,
  funds: number,
  userAccount: string,
}

const validation = (values) => {
  const errors = {}

  if (values.owners < values.confirmations) {
    errors.confirmations = 'Number of confirmations can not be higher than the number of owners'
  }

  return errors
}

const NewSafe = ({ values }: Object) => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">Deploy a new Safe</Heading>
    <Name />
    <Owners numOwners={values.owners} />
    <Confirmations />
    <Block margin="xl">
      <Button variant="raised" color="primary" type="submit">
        Create Safe
      </Button>
    </Block>
  </Block>
)

const initialValuesFrom = (userAccount: string) => ({
  owner0Address: userAccount,
})

const Open = ({
  funds, safeAddress, onCallSafeContractSubmit, onAddFunds, userAccount,
}: Props) => (
  <React.Fragment>
    <GnoForm
      onSubmit={onCallSafeContractSubmit}
      initialValues={initialValuesFrom(userAccount)}
      width="500"
      validation={validation}
    >
      { NewSafe }
    </GnoForm>
    <GnoForm onSubmit={onAddFunds} width="500">
      {(pristine, invalid) => (
        <Block margin="md">
          <Heading tag="h2" margin="lg">Add Funds to the safe</Heading>
          <div style={{ margin: '10px 0px' }}>
            <label style={{ marginRight: '10px' }}>{safeAddress || 'Not safe detected'}</label>
          </div>
          { safeAddress &&
            <div>
              <Field name="fundsToAdd" component={TextField} type="text" placeholder="ETH to add" />
              <Button type="submit" disabled={!safeAddress || pristine || invalid}>
                Add funds
              </Button>
            </div>
          }
          { safeAddress &&
            <div style={{ margin: '15px 0px' }}>
              Total funds in this safe: { funds || 0 } ETH
            </div>
          }
        </Block>
      )}
    </GnoForm>
  </React.Fragment>
)

export default Open
