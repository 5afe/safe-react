// @flow
import { fireEvent, cleanup } from '@testing-library/react'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { renderSafeView } from '~/test/builder/safe.dom.utils'
import { sleep } from '~/utils/timer'
import 'jest-dom/extend-expect'
import { SETTINGS_TAB_BTN_TESTID, SAFE_VIEW_NAME_HEADING_TESTID } from '~/routes/safe/components/Layout'
import { SAFE_NAME_INPUT_TESTID, SAFE_NAME_SUBMIT_BTN_TESTID } from '~/routes/safe/components/Settings/ChangeSafeName'

afterEach(cleanup)

describe('DOM > Feature > Settings - Name', () => {
  let store
  let safeAddress
  beforeEach(async () => {
    store = aNewStore()
    // using 4th account because other accounts were used in other tests and paid gas
    safeAddress = await aMinedSafe(store)
  })

  it('Changes safe name', async () => {
    const INITIAL_NAME = 'Safe Name'
    const NEW_NAME = 'NEW SAFE NAME'

    const SafeDom = renderSafeView(store, safeAddress)
    await sleep(1300)

    const safeNameHeading = SafeDom.getByTestId(SAFE_VIEW_NAME_HEADING_TESTID)
    expect(safeNameHeading).toHaveTextContent(INITIAL_NAME)

    // Open settings tab
    // Safe name setting screen should be pre-selected
    const settingsBtn = SafeDom.getByTestId(SETTINGS_TAB_BTN_TESTID)
    fireEvent.click(settingsBtn)

    // Change the name
    const safeNameInput = SafeDom.getByTestId(SAFE_NAME_INPUT_TESTID)
    const submitBtn = SafeDom.getByTestId(SAFE_NAME_SUBMIT_BTN_TESTID)
    fireEvent.change(safeNameInput, { target: { value: NEW_NAME } })
    fireEvent.click(submitBtn)

    // Check if the name changed
    expect(safeNameHeading).toHaveTextContent(NEW_NAME)
  })
})
