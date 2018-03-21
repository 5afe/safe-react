// @flow
import Button from 'material-ui/Button'
import * as React from 'react'
import { Form, Field } from 'react-final-form'
import TextField from '~/components/forms/TextField'
import Page from '~/components/layout/Page'
import PageFrame from '~/components/layout/PageFrame'
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
  <Page>
    <PageFrame>
      <Form
        onSubmit={onCallSafeContractSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <h2>Create a new Safe instance for testing purposes</h2>
            <div>
              <Button variant="raised" color="primary" type="submit">
                Create Safe
              </Button>
            </div>
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
    </PageFrame>
  </Page>
)

export default Open
