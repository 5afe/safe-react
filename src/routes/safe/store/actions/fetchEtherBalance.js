// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import type { GetState } from '~/store'
import { type GlobalState } from '~/store'

const fetchEtherBalance = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState) => {
  try {
    const state = getState()
    const ethBalance = state[SAFE_REDUCER_ID].getIn([SAFE_REDUCER_ID, safeAddress, 'ethBalance'])
    const newEthBalance = await getBalanceInEtherOf(safeAddress)
    if (newEthBalance !== ethBalance) {
      dispatch(updateSafe({ address: safeAddress, ethBalance: newEthBalance }))
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error when fetching Ether balance:', err)
  }
}

export default fetchEtherBalance
