// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { type GlobalState } from '~/store/index'

const fetchEtherBalance = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const ethBalance = await getBalanceInEtherOf(safeAddress)

    dispatch(updateSafe({ address: safeAddress, ethBalance }))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error when fetching Ether balance:', err)
  }
}

export default fetchEtherBalance
