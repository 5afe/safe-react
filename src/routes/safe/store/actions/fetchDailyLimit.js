// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { getDailyLimitFrom } from '~/routes/safe/component/Withdrawn/withdrawn'
import updateDailyLimit from './updateDailyLimit'

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const ethAddress = 0
  const dailyLimit: DailyLimitProps = await getDailyLimitFrom(safeAddress, ethAddress)

  return dispatch(updateDailyLimit(safeAddress, dailyLimit))
}
