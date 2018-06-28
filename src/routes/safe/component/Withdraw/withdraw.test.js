// @flow
import { aNewStore } from '~/store'
import { addEtherTo } from '~/test/utils/tokenMovements'
import { aDeployedSafe, executeWithdrawOn } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { buildMathPropsFrom } from '~/test/utils/buildReactRouterProps'
import { safeSelector } from '~/routes/safe/store/selectors/index'
import { type Match } from 'react-router-dom'

describe('Safe Blockchain Test', () => {
  let store
  beforeEach(async () => {
    store = aNewStore()
  })

  it('wihdrawn should return revert error if exceeded dailyLimit', async () => {
    // GIVEN
    const dailyLimitValue = 0.30
    const safeAddress = await aDeployedSafe(store, dailyLimitValue)
    await addEtherTo(safeAddress, '0.7')
    const value = 0.15

    // WHEN
    const match: Match = buildMathPropsFrom(safeAddress)
    const safe = safeSelector(store.getState(), { match })
    if (!safe) throw new Error()

    await executeWithdrawOn(safe, value)
    await executeWithdrawOn(safe, value)

    // THEN
    expect(executeWithdrawOn(safe, value)).rejects.toThrow('VM Exception while processing transaction: revert')
  })
})
