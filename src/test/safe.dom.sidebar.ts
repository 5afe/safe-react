// 
import { act, fireEvent } from '@testing-library/react'
import { aNewStore } from 'src/store'
import { aMinedSafe } from 'src/test/builder/safe.redux.builder'
import { renderSafeView } from 'src/test/builder/safe.dom.utils'
import '@testing-library/jest-dom/extend-expect'
import { TOGGLE_SIDEBAR_BTN_TESTID } from 'src/components/AppLayout/Sidebar/SafeHeader'
import { SIDEBAR_SAFELIST_ROW_TESTID } from 'src/components/SafeListSidebar/SafeList'
import { sleep } from 'src/utils/timer'

describe('DOM > Feature > Sidebar', () => {
  let store
  let safeAddress
  beforeEach(async () => {
    store = aNewStore()
    safeAddress = await aMinedSafe(store)
  })

  it('Shows "default" label for a single Safe', async () => {
    const SafeDom = await renderSafeView(store, safeAddress)

    act(() => {
      fireEvent.click(SafeDom.getByTestId(TOGGLE_SIDEBAR_BTN_TESTID))
    })

    const safes = SafeDom.getAllByTestId(SIDEBAR_SAFELIST_ROW_TESTID)
    expect(safes.length).toBe(1)

    expect(safes[0]).toContainElement(SafeDom.getByText('default'))
  })

  it('Changes default Safe', async () => {
    const SafeDom = await renderSafeView(store, safeAddress)
    await aMinedSafe(store)

    await sleep(2000)

    act(() => {
      fireEvent.click(SafeDom.getByTestId(TOGGLE_SIDEBAR_BTN_TESTID))
    })

    await sleep(400)

    const safes = SafeDom.getAllByTestId(SIDEBAR_SAFELIST_ROW_TESTID)
    expect(safes.length).toBe(2)

    expect(safes[0]).toContainElement(SafeDom.getByText('default'))
    expect(safes[1]).toContainElement(SafeDom.getByText('Make default'))

    act(() => {
      fireEvent.click(SafeDom.getByText('Make default'))
    })

    expect(safes[1]).toContainElement(SafeDom.getByText('default'))
    expect(safes[0]).toContainElement(SafeDom.getByText('Make default'))
  })
})
