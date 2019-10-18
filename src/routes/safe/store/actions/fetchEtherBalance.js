// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import Web3Integration from '~/logic/wallets/web3Integration'

const fetchEtherBalance = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const ethBalance = await Web3Integration.getBalanceInEtherOf(safeAddress)

    dispatch(updateSafe({ address: safeAddress, ethBalance }))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error when fetching Ether balance:', err)
  }
}

export default fetchEtherBalance
