import { fireEvent } from '@testing-library/react'
import { aNewStore } from 'src/store'
import { aMinedSafe } from 'src/test/builder/safe.redux.builder'
import { renderSafeView } from 'src/test/builder/safe.dom.utils'
import { sleep } from 'src/utils/timer'
import '@testing-library/jest-dom/extend-expect'
import { SETTINGS_TAB_BTN_TEST_ID, SAFE_VIEW_NAME_HEADING_TEST_ID } from 'src/routes/safe/container'
import { SAFE_NAME_INPUT_TEST_ID, SAFE_NAME_SUBMIT_BTN_TEST_ID } from 'src/routes/safe/components/Settings/SafeDetails'

describe('DOM > Feature > Settings - Name', () => {
  let store
  let safeAddress
  beforeEach(async () => {
    store = aNewStore()
    // using 4th account because other accounts were used in other tests and paid gas
    safeAddress = await aMinedSafe(store)
  })

  it('Changes Safe name', async () => {
    const INITIAL_NAME = 'Safe Name'
    const NEW_NAME = 'NEW SAFE NAME'

    const SafeDom = renderSafeView(store, safeAddress)
    await sleep(1300)

    const safeNameHeading = SafeDom.getByTestId(SAFE_VIEW_NAME_HEADING_TEST_ID)
    expect(safeNameHeading).toHaveTextContent(INITIAL_NAME)

    // Open settings tab
    // Safe name setting screen should be pre-selected
    const settingsBtn = SafeDom.getByTestId(SETTINGS_TAB_BTN_TEST_ID)
    fireEvent.click(settingsBtn)

    // Change the name
    const safeNameInput = SafeDom.getByTestId(SAFE_NAME_INPUT_TEST_ID)
    const submitBtn = SafeDom.getByTestId(SAFE_NAME_SUBMIT_BTN_TEST_ID)
    fireEvent.change(safeNameInput, { target: { value: NEW_NAME } })
    fireEvent.click(submitBtn)

    // Check if the name changed
    expect(safeNameHeading).toHaveTextContent(NEW_NAME)
  })
})
