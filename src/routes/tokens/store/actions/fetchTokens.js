// @flow
import { Map } from 'immutable'
import contract from 'truffle-contract'
import type { Dispatch as ReduxDispatch } from 'redux'
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/StandardToken.json'
import { getBalanceInEtherOf, getWeb3 } from '~/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import { makeToken, type Token, type TokenProps } from '~/routes/tokens/store/model/token'
import logo from '~/assets/icons/icon_etherTokens.svg'
import { ensureOnce } from '~/utils/singleton'
import addTokens from './addTokens'


const createStandardTokenContract = async () => {
  const web3 = getWeb3()
  const erc20Token = await contract(StandardToken)
  erc20Token.setProvider(web3.currentProvider)

  return erc20Token
}

export const getStandardTokenContract = ensureOnce(createStandardTokenContract)

export const calculateBalanceOf = async (tokenAddress: string, address: string, decimals: number) => {
  const erc20Token = await getStandardTokenContract()

  return erc20Token.at(tokenAddress)
    .then(instance => instance.balanceOf(address).then(funds => funds.div(10 ** decimals).toString()))
    .catch(() => '0')
}

export const fetchTokens = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const balance = await getBalanceInEtherOf(safeAddress)
  const ethBalance = makeToken({
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

  try {
    const balancesRecords = await Promise.all(json.map(async (item: TokenProps) => {
      const funds = await calculateBalanceOf(item.address, safeAddress, item.decimals)
      return makeToken({ ...item, funds })
    }))

    const balances: Map<string, Token> = Map().withMutations((map) => {
      balancesRecords.forEach(record => map.set(record.get('symbol'), record))
      map.set('ETH', ethBalance)
    })

    return dispatch(addTokens(safeAddress, balances))
  } catch (err) {
    // eslint-disable-next-line
    console.log("Error fetching token balances...")

    return Promise.resolve()
  }
}
