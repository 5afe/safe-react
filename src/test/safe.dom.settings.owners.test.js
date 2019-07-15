// @flow
import { fireEvent, cleanup } from '@testing-library/react'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { renderSafeView } from '~/test/builder/safe.dom.utils'
import { sleep } from '~/utils/timer'
import 'jest-dom/extend-expect'
import { SETTINGS_TAB_BTN_TESTID } from '~/routes/safe/components/Layout'
import { OWNERS_SETTINGS_TAB_TESTID } from '~/routes/safe/components/Settings'
import {
  RENAME_OWNER_BTN_TESTID,
  OWNERS_ROW_TESTID,
  REMOVE_OWNER_BTN_TESTID,
  ADD_OWNER_BTN_TESTID,
  REPLACE_OWNER_BTN_TESTID,
} from '~/routes/safe/components/Settings/ManageOwners'
import {
  RENAME_OWNER_INPUT_TESTID,
  SAVE_OWNER_CHANGES_BTN_TESTID,
} from '~/routes/safe/components/Settings/ManageOwners/EditOwnerModal'
import { REMOVE_OWNER_MODAL_NEXT_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/CheckOwner'
import { REMOVE_OWNER_THRESHOLD_NEXT_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/ThresholdForm'
import { REMOVE_OWNER_REVIEW_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/Review'
import { ADD_OWNER_THRESHOLD_NEXT_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/AddOwnerModal/screens/ThresholdForm'
import {
  ADD_OWNER_NAME_INPUT_TESTID,
  ADD_OWNER_ADDRESS_INPUT_TESTID,
  ADD_OWNER_NEXT_BTN_TESTID,
} from '~/routes/safe/components/Settings/ManageOwners/AddOwnerModal/screens/OwnerForm'
import { ADD_OWNER_SUBMIT_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/AddOwnerModal/screens/Review'
import {
  REPLACE_OWNER_NEXT_BTN_TESTID,
  REPLACE_OWNER_NAME_INPUT_TESTID,
  REPLACE_OWNER_ADDRESS_INPUT_TESTID,
} from '~/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/OwnerForm'
import { REPLACE_OWNER_SUBMIT_BTN_TESTID } from '~/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/Review'

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
    const ownersSettingsBtn = SafeDom.getByTestId(OWNERS_SETTINGS_TAB_TESTID)
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
    const ownersSettingsBtn = SafeDom.getByTestId(OWNERS_SETTINGS_TAB_TESTID)
    fireEvent.click(ownersSettingsBtn)
    await sleep(200)

    // check if there are 2 owners
    let ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TESTID)
    expect(ownerRows.length).toBe(2)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
    expect(ownerRows[1]).toHaveTextContent('Adol 2 Eth Account')
    expect(ownerRows[1]).toHaveTextContent('0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0')

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
    await sleep(1300)

    // check if owner was removed
    ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TESTID)
    expect(ownerRows.length).toBe(1)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
  })

  it('Adds a new owner', async () => {
    const NEW_OWNER_NAME = 'I am a new owner'
    const NEW_OWNER_ADDRESS = '0x0E329Fa8d6fCd1BA0cDA495431F1F7ca24F442c3'

    const SafeDom = renderSafeView(store, safeAddress)
    await sleep(1300)

    // Travel to settings
    const settingsBtn = SafeDom.getByTestId(SETTINGS_TAB_BTN_TESTID)
    fireEvent.click(settingsBtn)
    await sleep(200)

    // click on owners settings
    const ownersSettingsBtn = SafeDom.getByTestId(OWNERS_SETTINGS_TAB_TESTID)
    fireEvent.click(ownersSettingsBtn)
    await sleep(200)

    // check if there is 1 owner
    let ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TESTID)
    expect(ownerRows.length).toBe(1)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')

    // click add owner btn
    fireEvent.click(SafeDom.getByTestId(ADD_OWNER_BTN_TESTID))
    await sleep(200)

    // fill and travel add owner modal
    const ownerNameInput = SafeDom.getByTestId(ADD_OWNER_NAME_INPUT_TESTID)
    const ownerAddressInput = SafeDom.getByTestId(ADD_OWNER_ADDRESS_INPUT_TESTID)
    const nextBtn = SafeDom.getByTestId(ADD_OWNER_NEXT_BTN_TESTID)
    fireEvent.change(ownerNameInput, { target: { value: NEW_OWNER_NAME } })
    fireEvent.change(ownerAddressInput, { target: { value: NEW_OWNER_ADDRESS } })
    fireEvent.click(nextBtn)
    await sleep(200)

    fireEvent.click(SafeDom.getByTestId(ADD_OWNER_THRESHOLD_NEXT_BTN_TESTID))
    await sleep(200)
    fireEvent.click(SafeDom.getByTestId(ADD_OWNER_SUBMIT_BTN_TESTID))
    await sleep(1000)

    // check if owner was added
    ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TESTID)
    expect(ownerRows.length).toBe(2)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
    expect(ownerRows[1]).toHaveTextContent(NEW_OWNER_NAME)
    expect(ownerRows[1]).toHaveTextContent(NEW_OWNER_ADDRESS)
  })

  it('Replaces an owner', async () => {
    const NEW_OWNER_NAME = 'I replaced an old owner'
    const NEW_OWNER_ADDRESS = '0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e'

    const twoOwnersSafeAddress = await aMinedSafe(store, 2)

    const SafeDom = renderSafeView(store, twoOwnersSafeAddress)
    await sleep(1300)

    // Travel to settings
    const settingsBtn = SafeDom.getByTestId(SETTINGS_TAB_BTN_TESTID)
    fireEvent.click(settingsBtn)
    await sleep(200)

    // click on owners settings
    const ownersSettingsBtn = SafeDom.getByTestId(OWNERS_SETTINGS_TAB_TESTID)
    fireEvent.click(ownersSettingsBtn)
    await sleep(200)

    // check if there are 2 owners
    let ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TESTID)
    expect(ownerRows.length).toBe(2)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
    expect(ownerRows[1]).toHaveTextContent('Adol 2 Eth Account')
    expect(ownerRows[1]).toHaveTextContent('0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0')

    // click replace owner btn which opens the modal
    const replaceOwnerBtn = SafeDom.getAllByTestId(REPLACE_OWNER_BTN_TESTID)[1]
    fireEvent.click(replaceOwnerBtn)

    // fill and travel add owner modal
    const ownerNameInput = SafeDom.getByTestId(REPLACE_OWNER_NAME_INPUT_TESTID)
    const ownerAddressInput = SafeDom.getByTestId(REPLACE_OWNER_ADDRESS_INPUT_TESTID)
    const nextBtn = SafeDom.getByTestId(REPLACE_OWNER_NEXT_BTN_TESTID)
    fireEvent.change(ownerNameInput, { target: { value: NEW_OWNER_NAME } })
    fireEvent.change(ownerAddressInput, { target: { value: NEW_OWNER_ADDRESS } })
    fireEvent.click(nextBtn)
    await sleep(200)

    const replaceSubmitBtn = SafeDom.getByTestId(REPLACE_OWNER_SUBMIT_BTN_TESTID)
    fireEvent.click(replaceSubmitBtn)
    await sleep(1000)

    // check if the owner was replaced
    ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TESTID)
    expect(ownerRows.length).toBe(2)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
    expect(ownerRows[1]).toHaveTextContent(NEW_OWNER_NAME)
    expect(ownerRows[1]).toHaveTextContent(NEW_OWNER_ADDRESS)
  })
})
