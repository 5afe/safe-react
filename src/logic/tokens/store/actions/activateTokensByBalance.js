// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { Set } from 'immutable'
import { type GetState, type GlobalState } from '~/store'
import updateActiveTokens from '~/routes/safe/store/actions/updateActiveTokens'
import {
  safeActiveTokensSelectorBySafe,
  safeBlacklistedTokensSelectorBySafe,
  safesMapSelector,
} from '~/routes/safe/store/selectors'
import fetchTokenBalanceList from '~/logic/tokens/api/fetchTokenBalanceList'
import updateSafe from '~/routes/safe/store/actions/updateSafe'

const activateTokensByBalance = (safeAddress: string) => async (
  dispatch: ReduxDispatch<GlobalState>,
  getState: GetState,
) => {
  try {
    const result = await fetchTokenBalanceList(safeAddress)
    const safes = safesMapSelector(getState())
    const alreadyActiveTokens = safeActiveTokensSelectorBySafe(safeAddress, safes)
    const blacklistedTokens = safeBlacklistedTokensSelectorBySafe(safeAddress, safes)

    // addresses: potentially active tokens by balance
    // balances: tokens' balance returned by the backend
    const { addresses, balances } = result.data.reduce(
      (acc, { tokenAddress, balance }) => ({
        addresses: [...acc.addresses, tokenAddress],
        balances: [[tokenAddress, balance]],
      }),
      {
        addresses: [],
        balances: [],
      },
    )

    // update balance list for the safe
    dispatch(
      updateSafe({
        address: safeAddress,
        balances: Set(balances),
      }),
    )

    // active tokens by balance, excluding those already blacklisted and the `null` address
    const activeByBalance = addresses.filter(address => address !== null && !blacklistedTokens.includes(address))

    // need to persist those already active tokens, despite its balances
    const activeTokens = alreadyActiveTokens.toSet().union(activeByBalance)

    // update list of active tokens
    dispatch(updateActiveTokens(safeAddress, activeTokens))
  } catch (err) {
    console.error('Error fetching active token list', err)
  }

  return null
}

export default activateTokensByBalance
