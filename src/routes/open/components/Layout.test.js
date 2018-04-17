// @flow
import TestUtils from 'react-dom/test-utils'
import { store } from '~/store'
import { FIELD_NAME, FIELD_OWNERS, FIELD_CONFIRMATIONS, getOwnerNameBy, getOwnerAddressBy } from '~/routes/open/components/fields'
import { DEPLOYED_COMPONENT_ID } from '~/routes/open/components/FormConfirmation'
import { sleep } from '~/utils/timer'
import { getProviderInfo } from '~/wallets/getWeb3'
import { renderSafe } from '~/routes/safe/store/test/builder/deployedSafe.builder'

describe('React DOM TESTS > Create Safe form', () => {
  let open
  let provider
  beforeEach(async () => {
    provider = await getProviderInfo()
    open = await renderSafe(store)
  })

  it('should create a 1 owner safe after rendering correctly the form', async () => {
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(open, 'input')
    const fieldName = inputs[0]
    expect(fieldName.name).toEqual(FIELD_NAME)

    const fieldOwners = inputs[1]
    expect(fieldOwners.name).toEqual(FIELD_OWNERS)

    const fieldConfirmations = inputs[2]
    expect(fieldConfirmations.name).toEqual(FIELD_CONFIRMATIONS)

    TestUtils.Simulate.change(fieldOwners, { target: { value: '1' } })
    const inputsExpanded = TestUtils.scryRenderedDOMComponentsWithTag(open, 'input')

    const ownerName = inputsExpanded[2]
    expect(ownerName.name).toEqual(getOwnerNameBy(0))
    const ownerAddress = inputsExpanded[3]
    expect(ownerAddress.name).toEqual(getOwnerAddressBy(0))
    expect(ownerAddress.value).toEqual(provider.account)

    // WHEN
    TestUtils.Simulate.change(fieldName, { target: { value: 'Adolfo Safe' } })
    TestUtils.Simulate.change(fieldConfirmations, { target: { value: '1' } })
    TestUtils.Simulate.change(ownerName, { target: { value: 'Adolfo Eth Account' } })

    const form = TestUtils.findRenderedDOMComponentWithTag(open, 'form')
    // One submit per step when creating a safe
    TestUtils.Simulate.submit(form) // fill the form
    TestUtils.Simulate.submit(form) // confirming data
    TestUtils.Simulate.submit(form) // Executing transaction

    // giving some time to the component for updating its state with safe
    // before destroying its context
    await sleep(1500)

    // THEN
    const deployed = TestUtils.findRenderedDOMComponentWithClass(open, DEPLOYED_COMPONENT_ID)

    if (deployed) {
      const transactionHash = JSON.parse(deployed.getElementsByTagName('pre')[0].innerHTML)
      delete transactionHash.logsBloom
      // eslint-disable-next-line
      console.log(transactionHash)
    }
  })
})
