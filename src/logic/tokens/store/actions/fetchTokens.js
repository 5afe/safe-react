// @flow
import { List } from 'immutable'
import contract from 'truffle-contract'
import type { Dispatch as ReduxDispatch } from 'redux'
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import Web3Integration from '~/logic/wallets/web3Integration'
import { type GlobalState } from '~/store'
import { makeToken, type TokenProps } from '~/logic/tokens/store/model/token'
import { fetchTokenList } from '~/logic/tokens/api'
import { ensureOnce } from '~/utils/singleton'
import saveTokens from './saveTokens'

const createStandardTokenContract = async () => {
  const { web3 } = Web3Integration
  const erc20Token = await contract(StandardToken)
  erc20Token.setProvider(web3.currentProvider)
  return erc20Token
}

const createHumanFriendlyTokenContract = async () => {
  const { web3 } = Web3Integration
  const humanErc20Token = await contract(HumanFriendlyToken)
  humanErc20Token.setProvider(web3.currentProvider)

  return humanErc20Token
}

export const getHumanFriendlyToken = ensureOnce(createHumanFriendlyTokenContract)

export const getStandardTokenContract = ensureOnce(createStandardTokenContract)

export const fetchTokens = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const {
      data: { results: tokenList },
    } = await fetchTokenList()

    const tokens = List(tokenList.map((token: TokenProps) => makeToken(token)))

    dispatch(saveTokens(tokens))
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error fetching token list ' + err)

    return Promise.resolve()
  }
}

export default fetchTokens
