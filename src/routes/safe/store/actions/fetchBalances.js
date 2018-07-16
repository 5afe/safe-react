// @flow
import { Map } from 'immutable'
import contract from 'truffle-contract'
import type { Dispatch as ReduxDispatch } from 'redux'
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/StandardToken.json'
import { getBalanceInEtherOf, getWeb3 } from '~/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import { makeBalance, type Balance, type BalanceProps } from '~/routes/safe/store/model/balance'
import logo from '~/assets/icons/icon_etherTokens.svg'
import addBalances from './addBalances'

export const getStandardTokenContract = async () => {
  const web3 = getWeb3()
  const erc20Token = await contract(StandardToken)
  erc20Token.setProvider(web3.currentProvider)

  return erc20Token
}

export const calculateBalanceOf = async (tokenAddress: string, address: string, decimals: number) => {
  const erc20Token = await getStandardTokenContract()

  return erc20Token.at(tokenAddress)
    .then(instance => instance.balanceOf(address).then(funds => funds.div(10 ** decimals).toString()))
    .catch(() => '0')
}

export const fetchBalances = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const balance = await getBalanceInEtherOf(safeAddress)
  const ethBalance = makeBalance({
    address: '0',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUrl: logo,
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
  return Promise.all(json.map(async (item: BalanceProps) => {
    const funds = await calculateBalanceOf(item.address, safeAddress, item.decimals)
    return makeBalance({ ...item, funds })
  })).then((balancesRecords) => {
    const balances: Map<string, Balance> = Map().withMutations((map) => {
      balancesRecords.forEach(record => map.set(record.get('symbol'), record))
      map.set('ETH', ethBalance)
    })

    return dispatch(addBalances(safeAddress, balances))
  })
}
