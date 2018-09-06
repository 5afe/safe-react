// @flow
import TextField from '~/components/forms/TextField'
import * as React from 'react'
import * as TestUtils from 'react-dom/test-utils'
import GnoForm from '~/components/forms/GnoForm'
import { FIELD_OWNERS } from '~/routes/open/components/fields'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import { getProviderInfo } from '~/logic/wallets/getWeb3'
import Wrapper from '~/test/utils/Wrapper'
import { ADDRESS_REPEATED_ERROR } from '~/components/forms/validator'
import Owners from './index'

const onSubmitMock = () => {}
const childrenMock = () => {}

describe('React DOM TESTS > Create Safe form', () => {
  beforeEach(async () => {
    // init app web3 instance
    await getProviderInfo()
  })

  it('should not allow to continue if owners addresses are duplicated', async () => {
    // GIVEN
    const open = TestUtils.renderIntoDocument((
      <Wrapper>
        <GnoForm
          onSubmit={onSubmitMock}
          padding={15}
          render={({ values }) => (
            <Owners
              numOwners={values.owners}
              otherAccounts={getAccountsFrom(values)}
            />
          )}
        >
          {childrenMock}
        </GnoForm>
      </Wrapper>
    ))

    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(open, 'input')
    const fieldOwners = inputs[0]
    expect(fieldOwners.name).toEqual(FIELD_OWNERS)
    TestUtils.Simulate.change(fieldOwners, { target: { value: '2' } })

    // WHEN
    inputs = TestUtils.scryRenderedDOMComponentsWithTag(open, 'input')
    const firstOwnerAddress = inputs[2]
    TestUtils.Simulate.change(firstOwnerAddress, { target: { value: '0xC21aC257Db500a87c65Daa980432F216A719bA30' } })
    const secondOwnerAddress = inputs[4]
    TestUtils.Simulate.change(secondOwnerAddress, { target: { value: '0xC21aC257Db500a87c65Daa980432F216A719bA30' } })

    // THEN
    const muiFields = TestUtils.scryRenderedComponentsWithType(open, TextField)
    expect(5).toEqual(muiFields.length)
    const secondAddressField = muiFields[4]

    expect(secondAddressField.props.meta.valid).toBe(false)
    expect(secondAddressField.props.meta.error).toBe(ADDRESS_REPEATED_ERROR)
  })
})
