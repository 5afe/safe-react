// @flow
import Button from 'material-ui/Button'
import * as React from 'react'
import { Form, Field } from 'react-final-form'
import Block from '~/components/layout/Block'
import TextField from '~/components/forms/TextField'
import './App.scss'

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
    <Form
      onSubmit={onCallSafeContractSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Block margin="md">
            <h2>Create a new Safe instance for testing purposes</h2>
            <Block margin="sm">
              <Field name="name" component={TextField} type="text" placeholder="Safe name" />
            </Block>
            <Block margin="sm">
              <Button variant="raised" color="primary" type="submit">
                Create Safe
              </Button>
            </Block>
          </Block>
        </form>
      )}
    />
    <Form
      onSubmit={onAddFunds}
      render={({ handleSubmit, pristine, invalid }) => (
        <form onSubmit={handleSubmit}>
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
        </form>
      )}
    />
  </React.Fragment>
)

export default Open
