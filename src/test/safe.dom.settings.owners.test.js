// @flow
import { fireEvent, cleanup } from '@testing-library/react'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { renderSafeView } from '~/test/builder/safe.dom.utils'
import { sleep } from '~/utils/timer'
import 'jest-dom/extend-expect'
import { SETTINGS_TAB_BTN_TESTID } from '~/routes/safe/components/Layout'
import { OWNERS_SETTINGS_TAB_TEST_ID } from '~/routes/safe/components/Settings'
import {
  RENAME_OWNER_BTN_TESTID,
  OWNERS_ROW_TESTID,
  REMOVE_OWNER_BTN_TESTID,
} from '~/routes/safe/components/Settings/ManageOwners'
import {
  RENAME_OWNER_INPUT_TESTID,
  SAVE_OWNER_CHANGES_BTN_TESTID,
} from '~/routes/safe/components/Settings/ManageOwners/EditOwnerModal'
import { REMOVE_OWNER_MODAL_NEXT_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/CheckOwner'
import { REMOVE_OWNER_THRESHOLD_NEXT_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/ThresholdForm'
import { REMOVE_OWNER_REVIEW_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/Review'

afterEach(cleanup)

describe('DOM > Feature > Settings - Manage owners', () => {
  let store
  let safeAddress
  beforeEach(async () => {
    store = aNewStore()
    safeAddress = await aMinedSafe(store)
  })

  it("Changes owner's name", async () => {
    const NEW_OWNER_NAME = 'NEW OWNER NAME'

    const SafeDom = renderSafeView(store, safeAddress)
    await sleep(1300)

    // Travel to settings
    const settingsBtn = SafeDom.getByTestId(SETTINGS_TAB_BTN_TESTID)
    fireEvent.click(settingsBtn)
    await sleep(200)

    // click on owners settings
    const ownersSettingsBtn = SafeDom.getByTestId(OWNERS_SETTINGS_TAB_TEST_ID)
    fireEvent.click(ownersSettingsBtn)
    await sleep(200)

    // open rename owner modal
    const renameOwnerBtn = SafeDom.getByTestId(RENAME_OWNER_BTN_TESTID)
    fireEvent.click(renameOwnerBtn)

    // rename owner
    const ownerNameInput = SafeDom.getByTestId(RENAME_OWNER_INPUT_TESTID)
    const saveOwnerChangesBtn = SafeDom.getByTestId(SAVE_OWNER_CHANGES_BTN_TESTID)
    fireEvent.change(ownerNameInput, { target: { value: NEW_OWNER_NAME } })
    fireEvent.click(saveOwnerChangesBtn)
    await sleep(200)

    // check if the name updated
    const ownerRow = SafeDom.getByTestId(OWNERS_ROW_TESTID)
    expect(ownerRow).toHaveTextContent(NEW_OWNER_NAME)
  })

  it('Removes an owner', async () => {
    const twoOwnersSafeAddress = await aMinedSafe(store, 2)

    const SafeDom = renderSafeView(store, twoOwnersSafeAddress)
    await sleep(1300)

    // Travel to settings
    const settingsBtn = SafeDom.getByTestId(SETTINGS_TAB_BTN_TESTID)
    fireEvent.click(settingsBtn)
    await sleep(200)

    // click on owners settings
    const ownersSettingsBtn = SafeDom.getByTestId(OWNERS_SETTINGS_TAB_TEST_ID)
    fireEvent.click(ownersSettingsBtn)
    await sleep(200)

    // check if there are 2 owners
    let ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TESTID)
    expect(ownerRows.length).toBe(2)

    // click remove owner btn which opens the modal
    const removeOwnerBtn = SafeDom.getAllByTestId(REMOVE_OWNER_BTN_TESTID)[1]
    fireEvent.click(removeOwnerBtn)

    // modal navigation
    const nextBtnStep1 = SafeDom.getByTestId(REMOVE_OWNER_MODAL_NEXT_BTN_TESTID)
    fireEvent.click(nextBtnStep1)

    const nextBtnStep2 = SafeDom.getByTestId(REMOVE_OWNER_THRESHOLD_NEXT_BTN_TESTID)
    fireEvent.click(nextBtnStep2)

    const nextBtnStep3 = SafeDom.getByTestId(REMOVE_OWNER_REVIEW_BTN_TESTID)
    fireEvent.click(nextBtnStep3)
    await sleep(400)

    // check if owner was removed
    ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TESTID)
    expect(ownerRows.length).toBe(1)
  })

  it('Replaces a owner', async () => {})

  it('Adds a new owner', async () => {})
})
