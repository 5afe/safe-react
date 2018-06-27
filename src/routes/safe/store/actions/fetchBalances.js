// @flow
import { Map } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'
import { getBalanceInEtherOf } from '~/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import { makeBalance, type Balance } from '~/routes/safe/store/model/balance'
import addBalances from './addBalances'

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const balance = await getBalanceInEtherOf(safeAddress)
  const ethBalance = makeBalance({
    address: '0',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUrl: 'assets/icons/icon_etherTokens.svg',
    funds: balance,
  })

  const header = new Headers({
    'Access-Control-Allow-Origin': '*',
  })

  const sentData = {
    mode: 'cors',
    header,
  }

  const response = await fetch('https://gist.githubusercontent.com/rmeissner/98911fcf74b0ea9731e2dae2441c97a4/raw/', sentData)
  if (!response.ok) {
    throw new Error('Error querying safe balances')
  }

  const json = await response.json()
  const balances: Map<string, Balance> = Map().withMutations((map) => {
    json.forEach(item => map.set(item.symbol, makeBalance(item)))
    map.set('ETH', ethBalance)
  })

  return dispatch(addBalances(safeAddress, balances))
}
