import { getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'
import updateSafe from 'src/routes/safe/store/actions/updateSafe'
import { SAFE_REDUCER_ID } from 'src/routes/safe/store/reducer/safe'

const fetchEtherBalance = (safeAddress) => async (dispatch, getState) => {
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
