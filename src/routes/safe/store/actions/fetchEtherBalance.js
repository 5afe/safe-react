// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import type { Safe } from '~/routes/safe/store/models/safe'
import { type GlobalState } from '~/store/index'

const fetchEtherBalance = (safe: Safe) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const { address, ethBalance } = safe
    const newEthBalance = await getBalanceInEtherOf(address)

    if (newEthBalance !== ethBalance) {
      dispatch(updateSafe({ address, newEthBalance }))
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error when fetching Ether balance:', err)
  }
}

export default fetchEtherBalance
