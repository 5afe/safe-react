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

describe('DOM > Feature > Settings > Manage owners', () => {
  let store
  let safeAddress
  beforeEach(async () => {
    store = aNewStore()
    // using 4th account because other accounts were used in other tests and paid gas
    safeAddress = await aMinedSafe(store)
  })

  it('Changes owner\'s name', async () => {

  })
})
