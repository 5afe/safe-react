import { getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import { Dispatch } from 'redux'
import { backOff } from 'exponential-backoff'
import { AppReduxState } from 'src/store'

const fetchEtherBalance = (safeAddress: string) => async (
  dispatch: Dispatch,
  getState: () => AppReduxState,
): Promise<void> => {
  try {
    const state = getState()
    const ethBalance = state[SAFE_REDUCER_ID].getIn(['safes', safeAddress, 'ethBalance'])
    const newEthBalance = await backOff(() => getBalanceInEtherOf(safeAddress))
    if (newEthBalance !== ethBalance) {
      dispatch(updateSafe({ address: safeAddress, ethBalance: newEthBalance }))
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error when fetching Ether balance:', err)
  }
}

export default fetchEtherBalance
