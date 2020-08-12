// 
import { fireEvent, waitForElement } from '@testing-library/react'
import { aNewStore } from 'src/store'
import { aMinedSafe } from 'src/test/builder/safe.redux.builder'
import { renderSafeView } from 'src/test/builder/safe.dom.utils'
import { sleep } from 'src/utils/timer'
import '@testing-library/jest-dom/extend-expect'
import {
  checkRegisteredTxAddOwner,
  checkRegisteredTxRemoveOwner,
  checkRegisteredTxReplaceOwner,
} from './utils/transactions'
import { SETTINGS_TAB_BTN_TEST_ID } from 'src/routes/safe/container'
import { OWNERS_SETTINGS_TAB_TEST_ID } from 'src/routes/safe/components/Settings'
import {
  RENAME_OWNER_BTN_TEST_ID,
  OWNERS_ROW_TEST_ID,
  REMOVE_OWNER_BTN_TEST_ID,
  ADD_OWNER_BTN_TEST_ID,
  REPLACE_OWNER_BTN_TEST_ID,
} from 'src/routes/safe/components/Settings/ManageOwners'
import {
  RENAME_OWNER_INPUT_TEST_ID,
  SAVE_OWNER_CHANGES_BTN_TEST_ID,
} from 'src/routes/safe/components/Settings/ManageOwners/EditOwnerModal'
import { REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID } from 'src/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/CheckOwner'
import { REMOVE_OWNER_THRESHOLD_NEXT_BTN_TEST_ID } from 'src/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/ThresholdForm'
import { REMOVE_OWNER_REVIEW_BTN_TEST_ID } from 'src/routes/safe/components/Settings/ManageOwners/RemoveOwnerModal/screens/Review'
import { ADD_OWNER_THRESHOLD_NEXT_BTN_TEST_ID } from 'src/routes/safe/components/Settings/ManageOwners/AddOwnerModal/screens/ThresholdForm'
import {
  ADD_OWNER_NAME_INPUT_TEST_ID,
  ADD_OWNER_ADDRESS_INPUT_TEST_ID,
  ADD_OWNER_NEXT_BTN_TEST_ID,
} from 'src/routes/safe/components/Settings/ManageOwners/AddOwnerModal/screens/OwnerForm'
import { ADD_OWNER_SUBMIT_BTN_TEST_ID } from 'src/routes/safe/components/Settings/ManageOwners/AddOwnerModal/screens/Review'
import {
  REPLACE_OWNER_NEXT_BTN_TEST_ID,
  REPLACE_OWNER_NAME_INPUT_TEST_ID,
  REPLACE_OWNER_ADDRESS_INPUT_TEST_ID,
} from 'src/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/OwnerForm'
import { REPLACE_OWNER_SUBMIT_BTN_TEST_ID } from 'src/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/Review'

const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

const travelToOwnerSettings = async (dom) => {
  const settingsBtn = await waitForElement(() => dom.getByTestId(SETTINGS_TAB_BTN_TEST_ID))
  fireEvent.click(settingsBtn)

  // click on owners settings
  const ownersSettingsBtn = await waitForElement(() => dom.getByTestId(OWNERS_SETTINGS_TAB_TEST_ID))
  fireEvent.click(ownersSettingsBtn)

  await sleep(500)
}

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
    await travelToOwnerSettings(SafeDom)

    // open rename owner modal
    const renameOwnerBtn = await waitForElement(() => SafeDom.getByTestId(RENAME_OWNER_BTN_TEST_ID))
    fireEvent.click(renameOwnerBtn)

    // rename owner
    const ownerNameInput = SafeDom.getByTestId(RENAME_OWNER_INPUT_TEST_ID)
    const saveOwnerChangesBtn = SafeDom.getByTestId(SAVE_OWNER_CHANGES_BTN_TEST_ID)
    fireEvent.change(ownerNameInput, { target: { value: NEW_OWNER_NAME } })
    fireEvent.click(saveOwnerChangesBtn)
    await sleep(200)

    // check if the name updated
    const ownerRow = SafeDom.getByTestId(OWNERS_ROW_TEST_ID)
    expect(ownerRow).toHaveTextContent(NEW_OWNER_NAME)
  })

  it('Removes an owner', async () => {
    const twoOwnersSafeAddress = await aMinedSafe(store, 2)

    const SafeDom = renderSafeView(store, twoOwnersSafeAddress)
    await sleep(1300)

    // Travel to settings
    await travelToOwnerSettings(SafeDom)

    // check if there are 2 owners
    let ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TEST_ID)
    expect(ownerRows.length).toBe(2)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
    expect(ownerRows[1]).toHaveTextContent('Adol 2 Eth Account')
    expect(ownerRows[1]).toHaveTextContent('0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0')

    // click remove owner btn which opens the modal
    const removeOwnerBtn = SafeDom.getAllByTestId(REMOVE_OWNER_BTN_TEST_ID)[1]
    fireEvent.click(removeOwnerBtn)

    // modal navigation
    const nextBtnStep1 = SafeDom.getByTestId(REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID)
    fireEvent.click(nextBtnStep1)

    const nextBtnStep2 = SafeDom.getByTestId(REMOVE_OWNER_THRESHOLD_NEXT_BTN_TEST_ID)
    fireEvent.click(nextBtnStep2)

    const nextBtnStep3 = SafeDom.getByTestId(REMOVE_OWNER_REVIEW_BTN_TEST_ID)
    fireEvent.click(nextBtnStep3)
    await sleep(1300)

    // check if owner was removed
    await travelToOwnerSettings(SafeDom)

    ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TEST_ID)
    expect(ownerRows.length).toBe(1)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')

    // Check that the transaction was registered
    await checkRegisteredTxRemoveOwner(SafeDom, '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0')
  })

  it('Adds a new owner', async () => {
    const NEW_OWNER_NAME = 'I am a new owner'
    const NEW_OWNER_ADDRESS = '0x0E329Fa8d6fCd1BA0cDA495431F1F7ca24F442c3'

    const SafeDom = renderSafeView(store, safeAddress)
    await sleep(1300)

    // Travel to settings
    await travelToOwnerSettings(SafeDom)

    // check if there is 1 owner
    let ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TEST_ID)
    expect(ownerRows.length).toBe(1)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')

    // click add owner btn
    fireEvent.click(SafeDom.getByTestId(ADD_OWNER_BTN_TEST_ID))
    await sleep(200)

    // fill and travel add owner modal
    const ownerNameInput = SafeDom.getByTestId(ADD_OWNER_NAME_INPUT_TEST_ID)
    const ownerAddressInput = SafeDom.getByTestId(ADD_OWNER_ADDRESS_INPUT_TEST_ID)
    const nextBtn = SafeDom.getByTestId(ADD_OWNER_NEXT_BTN_TEST_ID)
    fireEvent.change(ownerNameInput, { target: { value: NEW_OWNER_NAME } })
    fireEvent.change(ownerAddressInput, { target: { value: NEW_OWNER_ADDRESS } })
    fireEvent.click(nextBtn)
    await sleep(200)

    fireEvent.click(SafeDom.getByTestId(ADD_OWNER_THRESHOLD_NEXT_BTN_TEST_ID))
    await sleep(200)
    fireEvent.click(SafeDom.getByTestId(ADD_OWNER_SUBMIT_BTN_TEST_ID))
    await sleep(1500)

    // check if owner was added
    await travelToOwnerSettings(SafeDom)

    ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TEST_ID)
    expect(ownerRows.length).toBe(2)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
    expect(ownerRows[1]).toHaveTextContent(NEW_OWNER_NAME)
    expect(ownerRows[1]).toHaveTextContent(NEW_OWNER_ADDRESS)
    // Check that the transaction was registered
    await checkRegisteredTxAddOwner(SafeDom, NEW_OWNER_ADDRESS)
  })

  it('Replaces an owner', async () => {
    const NEW_OWNER_NAME = 'I replaced an old owner'
    const NEW_OWNER_ADDRESS = '0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e'

    const twoOwnersSafeAddress = await aMinedSafe(store, 2)

    const SafeDom = renderSafeView(store, twoOwnersSafeAddress)
    await sleep(1300)

    // Travel to settings
    await travelToOwnerSettings(SafeDom)

    // check if there are 2 owners
    let ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TEST_ID)
    expect(ownerRows.length).toBe(2)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
    expect(ownerRows[1]).toHaveTextContent('Adol 2 Eth Account')
    expect(ownerRows[1]).toHaveTextContent('0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0')

    // click replace owner btn which opens the modal
    const replaceOwnerBtn = SafeDom.getAllByTestId(REPLACE_OWNER_BTN_TEST_ID)[1]
    fireEvent.click(replaceOwnerBtn)

    // fill and travel add owner modal
    const ownerNameInput = SafeDom.getByTestId(REPLACE_OWNER_NAME_INPUT_TEST_ID)
    const ownerAddressInput = SafeDom.getByTestId(REPLACE_OWNER_ADDRESS_INPUT_TEST_ID)
    const nextBtn = SafeDom.getByTestId(REPLACE_OWNER_NEXT_BTN_TEST_ID)
    fireEvent.change(ownerNameInput, { target: { value: NEW_OWNER_NAME } })
    fireEvent.change(ownerAddressInput, { target: { value: NEW_OWNER_ADDRESS } })
    fireEvent.click(nextBtn)
    await sleep(200)

    const replaceSubmitBtn = SafeDom.getByTestId(REPLACE_OWNER_SUBMIT_BTN_TEST_ID)
    fireEvent.click(replaceSubmitBtn)
    await sleep(1000)

    // check if the owner was replaced
    await travelToOwnerSettings(SafeDom)

    ownerRows = SafeDom.getAllByTestId(OWNERS_ROW_TEST_ID)
    expect(ownerRows.length).toBe(2)
    expect(ownerRows[0]).toHaveTextContent('Adol 1 Eth Account')
    expect(ownerRows[0]).toHaveTextContent('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
    expect(ownerRows[1]).toHaveTextContent(NEW_OWNER_NAME)
    expect(ownerRows[1]).toHaveTextContent(NEW_OWNER_ADDRESS)

    // Check that the transaction was registered
    await checkRegisteredTxReplaceOwner(SafeDom, '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', NEW_OWNER_ADDRESS)
  })
})
