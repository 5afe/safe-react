// @flow
import { List } from 'immutable'
import logo from '~/assets/icons/icon_etherTokens.svg'
import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import { makeToken, type Token } from '~/routes/tokens/store/model/token'

export const ETH_ADDRESS = '0'
export const isEther = (symbol: string) => symbol === 'ETH'

export const getSafeEthToken = async (safeAddress: string) => {
  const balance = await getBalanceInEtherOf(safeAddress)

  const ethBalance = makeToken({
    address: '0',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUri: logo,
    funds: balance,
  })

  return ethBalance
}

export const calculateActiveErc20TokensFrom = (tokens: List<Token>) => {
  const addresses = List().withMutations(list =>
    tokens.forEach((token: Token) => {
      if (isEther(token.get('symbol'))) {
        return
      }

      if (!token.get('status')) {
        return
      }

      list.push(token.address)
    }))

  return addresses
}
