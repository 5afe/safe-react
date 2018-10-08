// @flow
import { type Match } from 'react-router-dom'
import { aNewStore } from '~/store'
import { addEtherTo, executeWithdrawOn } from '~/test/utils/tokenMovements'
import { buildMathPropsFrom } from '~/test/utils/buildReactRouterProps'
import { safeSelector } from '~/routes/safe/store/selectors/index'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'

describe('DailyLimit Blockchain Test', () => {
  let store
  beforeEach(async () => {
    store = aNewStore()
  })

  it('wihdrawn should return revert error if exceeded dailyLimit', async () => {
    // GIVEN
    const dailyLimitValue = 0.30
    const safeAddress = await aMinedSafe(store, 1, 1, dailyLimitValue)
    await addEtherTo(safeAddress, '0.7')
    const value = 0.15

    // WHEN
    const match: Match = buildMathPropsFrom(safeAddress)
    const safe = safeSelector(store.getState(), { match })
    if (!safe) throw new Error()

    await executeWithdrawOn(safe, value)
    await executeWithdrawOn(safe, value)

    // THEN
    expect(executeWithdrawOn(safe, value)).rejects.toThrow('VM Exception while processing transaction: revert Daily limit has been reached')
  })
})
