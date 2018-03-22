// @flow
import Button from 'material-ui/Button'
import * as React from 'react'
import { Field } from 'react-final-form'
import Block from '~/components/layout/Block'
import TextField from '~/components/forms/TextField'
import GnoForm from '~/components/forms/GnoForm'
import { composeValidators, minValue, mustBeNumber, required } from '~/components/forms/validator'

type Props = {
  onCallSafeContractSubmit: Function,
  onAddFunds: Function,
  safeAddress: string,
  funds: number,
}

const Open = ({
  funds, safeAddress, onCallSafeContractSubmit, onAddFunds,
}: Props) => (
  <React.Fragment>
    <GnoForm onSubmit={onCallSafeContractSubmit} width="500">
      { () => (
        <Block margin="md">
          <h2>Deploy a new Safe</h2>
          <Block margin="sm">
            <Field name="name" component={TextField} type="text" validate={required} placeholder="Safe name*" />
          </Block>
          <Block margin="sm">
            <Field
              name="confirmations"
              component={TextField}
              type="text"
              validate={composeValidators(required, mustBeNumber, minValue(1))}
              placeholder="Required confirmations*"
            />
          </Block>
          <Block margin="sm">
            <Button variant="raised" color="primary" type="submit">
              Create Safe
            </Button>
          </Block>
        </Block>
      )}
    </GnoForm>
    <GnoForm onSubmit={onAddFunds} width="500">
      {(pristine, invalid) => (
        <Block margin="md">
          <h2>Add Funds to the safe</h2>
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
