// @flow
import { List, Map } from 'immutable'
import contract from 'truffle-contract'
import type { Dispatch as ReduxDispatch } from 'redux'
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/StandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import { getWeb3 } from '~/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import { makeToken, type Token, type TokenProps } from '~/routes/tokens/store/model/token'
import { ensureOnce } from '~/utils/singleton'
import { getTokens } from '~/utils/localStorage/tokens'
import { getSafeEthToken } from '~/utils/tokens'
import { enhancedFetch } from '~/utils/fetch'
import addTokens from './addTokens'

const createStandardTokenContract = async () => {
  const web3 = getWeb3()
  const erc20Token = await contract(StandardToken)
  erc20Token.setProvider(web3.currentProvider)

  return erc20Token
}
const createHumanFriendlyTokenContract = async () => {
  const web3 = getWeb3()
  const humanErc20Token = await contract(HumanFriendlyToken)
  humanErc20Token.setProvider(web3.currentProvider)

  return humanErc20Token
}

export const getHumanFriendlyToken = ensureOnce(createHumanFriendlyTokenContract)

export const getStandardTokenContract = ensureOnce(createStandardTokenContract)

export const calculateBalanceOf = async (tokenAddress: string, address: string, decimals: number) => {
  const erc20Token = await getStandardTokenContract()

  return erc20Token.at(tokenAddress)
    .then(instance => instance.balanceOf(address).then(funds => funds.div(10 ** decimals).toString()))
    .catch(() => '0')
}

export const fetchTokensData = async () => {
  const url = 'https://gist.githubusercontent.com/rmeissner/98911fcf74b0ea9731e2dae2441c97a4/raw/'
  const errMsg = 'Error querying safe balances'
  return enhancedFetch(url, errMsg)
}

export const fetchTokens = (safeAddress: string) =>
  async (dispatch: ReduxDispatch<GlobalState>) => {
    const tokens: List<string> = getTokens(safeAddress)
    const ethBalance = await getSafeEthToken(safeAddress)

    const json = await exports.fetchTokensData()

    try {
      const balancesRecords = await Promise.all(json.map(async (item: TokenProps) => {
        const status = tokens.includes(item.address)
        const funds = status ? await calculateBalanceOf(item.address, safeAddress, item.decimals) : '0'

        return makeToken({ ...item, status, funds })
      }))

      const balances: Map<string, Token> = Map().withMutations((map) => {
        balancesRecords.forEach(record => map.set(record.get('symbol'), record))

        map.set('ETH', ethBalance)
      })

      return dispatch(addTokens(safeAddress, balances))
    } catch (err) {
      // eslint-disable-next-line
      console.log("Error fetching token balances... " + err)

      return Promise.resolve()
    }
  }
