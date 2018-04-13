// @flow
import TextField from '~/components/forms/TextField'
import * as React from 'react'
import * as TestUtils from 'react-dom/test-utils'
import Layout from '~/routes/open/components/Layout'
import { FIELD_CONFIRMATIONS, FIELD_OWNERS } from '~/routes/open/components/fields'
import { getProviderInfo } from '~/wallets/getWeb3'
import Wrapper from '~/test/Wrapper'
import { CONFIRMATIONS_ERROR } from '~/routes/open/components/SafeForm'

describe('React DOM TESTS > Create Safe form', () => {
  beforeEach(async () => {
    // init app web3 instance
    await getProviderInfo()
  })

  it('should not allow to continue if confirmations are higher than owners', async () => {
    // GIVEN
    const open = TestUtils.renderIntoDocument((
      <Wrapper>
        <Layout
          provider="METAMASK"
          userAccount="foo"
          safeAddress=""
          safeTx=""
          onCallSafeContractSubmit={() => { }}
        />
      </Wrapper>
    ))

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(open, 'input')

    const fieldOwners = inputs[1]
    expect(fieldOwners.name).toEqual(FIELD_OWNERS)
    TestUtils.Simulate.change(fieldOwners, { target: { value: '1' } })

    const fieldConfirmations = inputs[2]
    expect(fieldConfirmations.name).toEqual(FIELD_CONFIRMATIONS)

    // WHEN
    TestUtils.Simulate.change(fieldConfirmations, { target: { value: '2' } })

    // THEN
    const muiFields = TestUtils.scryRenderedComponentsWithType(open, TextField)
    expect(5).toEqual(muiFields.length)
    const confirmationsField = muiFields[4]

    expect(confirmationsField.props.meta.valid).toBe(false)
    expect(confirmationsField.props.meta.error).toBe(CONFIRMATIONS_ERROR)
  })
})
