import { getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'
import updateSafe from 'src/routes/safe/store/actions/updateSafe'
import { SAFE_REDUCER_ID } from 'src/routes/safe/store/reducer/safe'
import { Dispatch } from 'redux'
import { backOff } from 'exponential-backoff'
import { State } from '../../../../store'

let isFetchingData = false
const fetchEtherBalance = (safeAddress: string) => async <T extends () => unknown>(
  dispatch: Dispatch,
  getState: () => State,
): Promise<void> => {
  if (isFetchingData) {
    return
  }
  try {
    isFetchingData = true
    const state = getState()
    const ethBalance = state[SAFE_REDUCER_ID].getIn([SAFE_REDUCER_ID, safeAddress, 'ethBalance'])

    const newEthBalance = await backOff(() => getBalanceInEtherOf(safeAddress))

    if (newEthBalance !== ethBalance) {
      dispatch(updateSafe({ address: safeAddress, ethBalance: newEthBalance }))
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error when fetching Ether balance:', err)
  } finally {
    isFetchingData = false
  }
}

export default fetchEtherBalance
