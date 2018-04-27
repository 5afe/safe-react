// @flow
import TextField from '~/components/forms/TextField'
import * as React from 'react'
import * as TestUtils from 'react-dom/test-utils'
import Layout from '~/routes/open/components/Layout'
import { FIELD_CONFIRMATIONS, FIELD_OWNERS } from '~/routes/open/components/fields'
import { getProviderInfo } from '~/wallets/getWeb3'
import Wrapper from '~/test/Wrapper'
import { CONFIRMATIONS_ERROR } from '~/routes/open/components/SafeForm'

const obSubmitMock = () => {}

describe('React DOM TESTS > Create Safe form', () => {
  let open
  let fieldOwners
  let fieldConfirmations
  beforeEach(async () => {
    // init app web3 instance
    await getProviderInfo()

    open = TestUtils.renderIntoDocument((
      <Wrapper>
        <Layout
          provider="METAMASK"
          userAccount="foo"
          safeAddress=""
          safeTx=""
          onCallSafeContractSubmit={obSubmitMock}
        />
      </Wrapper>
    ))

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(open, 'input')
    const indexOwners = 1
    const indexConfirmations = 2
    fieldOwners = inputs[indexOwners]
    fieldConfirmations = inputs[indexConfirmations]

    expect(fieldOwners.name).toEqual(FIELD_OWNERS)
    expect(fieldConfirmations.name).toEqual(FIELD_CONFIRMATIONS)
  })

  it('should not allow to continue if confirmations are higher than owners', async () => {
    // GIVEN
    TestUtils.Simulate.change(fieldOwners, { target: { value: '1' } })

    // WHEN
    TestUtils.Simulate.change(fieldConfirmations, { target: { value: '2' } })

    // THEN
    const muiFields = TestUtils.scryRenderedComponentsWithType(open, TextField)
    expect(6).toEqual(muiFields.length)
    const confirmationsField = muiFields[4]

    expect(confirmationsField.props.meta.valid).toBe(false)
    expect(confirmationsField.props.meta.error).toBe(CONFIRMATIONS_ERROR)
  })

  it('should raise error when confirmations are 012 and number of owners are 2', async () => {
    // GIVEN
    TestUtils.Simulate.change(fieldOwners, { target: { value: '2' } })
    // WHEN
    TestUtils.Simulate.change(fieldConfirmations, { target: { value: '014' } })

    // THEN
    const muiFields = TestUtils.scryRenderedComponentsWithType(open, TextField)
    expect(8).toEqual(muiFields.length)
    const confirmationsField = muiFields[6]

    expect(confirmationsField.props.meta.valid).toBe(false)
    expect(confirmationsField.props.meta.error).toBe(CONFIRMATIONS_ERROR)
  })
})
