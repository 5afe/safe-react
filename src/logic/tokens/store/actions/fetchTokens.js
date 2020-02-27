// @flow
import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import HumanFriendlyToken from '@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'
import { List } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'
import contract from 'truffle-contract'

import saveTokens from './saveTokens'

import { fetchTokenList } from '~/logic/tokens/api'
import { type TokenProps, makeToken } from '~/logic/tokens/store/model/token'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type GlobalState } from '~/store'
import { ensureOnce } from '~/utils/singleton'

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

export const fetchTokens = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const {
      data: { results: tokenList },
    } = await fetchTokenList()

    const tokens = List(tokenList.map((token: TokenProps) => makeToken(token)))

    dispatch(saveTokens(tokens))
  } catch (err) {
    console.error('Error fetching token list', err)

    return Promise.resolve()
  }
}

export default fetchTokens
