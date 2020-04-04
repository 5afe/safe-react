// 

import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { } from '~/store'

const fetchEtherBalance = (safe) => async (dispatch) => {
  try {
    const { address, ethBalance } = safe
    const newEthBalance = await getBalanceInEtherOf(address)

    if (newEthBalance !== ethBalance) {
      dispatch(updateSafe({ address, ethBalance: newEthBalance }))
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error when fetching Ether balance:', err)
  }
}

export default fetchEtherBalance
