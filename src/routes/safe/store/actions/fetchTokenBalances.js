// @flow
import { BigNumber } from 'bignumber.js'
import { List, Map } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import updateSafe from './updateSafe'

import generateBatchRequests from '~/logic/contracts/generateBatchRequests'
import { OnlyBalanceToken, getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import { type Token } from '~/logic/tokens/store/model/token'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { ETHEREUM_NETWORK, getWeb3 } from '~/logic/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import { NETWORK } from '~/utils/constants'

// List of all the non-standard ERC20 tokens
const nonStandardERC20 = [
  // DATAcoin
  { network: ETHEREUM_NETWORK.RINKEBY, address: '0x0cf0ee63788a0849fe5297f3407f701e122cc023' },
]

// This is done due to an issues with DATAcoin contract in Rinkeby
// https://rinkeby.etherscan.io/address/0x0cf0ee63788a0849fe5297f3407f701e122cc023#readContract
// It doesn't have a `balanceOf` method implemented.
const isStandardERC20 = (address: string): boolean => {
  return !nonStandardERC20.find((token) => sameAddress(address, token.address) && sameAddress(NETWORK, token.network))
}

const getTokensBalances = (tokens: List<Token>, safeAddress: string) => {
  const web3 = getWeb3()
  const web3Batch = new web3.BatchRequest()

  const safeTokens = tokens.toJS().filter(({ address }) => address !== ETH_ADDRESS)
  const whenSafeTokensBalances = safeTokens.map((token) => {
    // As a fallback, we're using `balances`
    const method = isStandardERC20(token.address) ? 'balanceOf' : 'balances'

    return generateBatchRequests({
      abi: OnlyBalanceToken.abi,
      address: token.address,
      batch: web3Batch,
      context: token,
      methods: [{ method, args: [safeAddress] }],
    })
  })

  web3Batch.execute()

  return Promise.all(whenSafeTokensBalances).then((safeTokensBalances) =>
    safeTokensBalances.map(([token, tokenBalance]) => {
      const balance = new BigNumber(tokenBalance).div(`1e${token.decimals}`).toFixed()

      return {
        address: token.address,
        balance: balance === 'NaN' ? '0' : balance,
      }
    }),
  )
}

export const calculateBalanceOf = async (tokenAddress: string, safeAddress: string, decimals: number = 18) => {
  if (tokenAddress === ETH_ADDRESS) {
    return '0'
  }
  const erc20Token = await getStandardTokenContract()
  let balance = 0

  try {
    const token = await erc20Token.at(tokenAddress)
    balance = await token.balanceOf(safeAddress)
  } catch (err) {
    console.error('Failed to fetch token balances: ', tokenAddress, err)
  }

  return new BigNumber(balance).div(10 ** decimals).toString()
}

const fetchTokenBalances = (safeAddress: string, tokens: List<Token>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  if (!safeAddress || !tokens || !tokens.size) {
    return
  }
  try {
    const withBalances = await getTokensBalances(tokens, safeAddress)

    const balances = Map().withMutations((map) => {
      withBalances.forEach(({ address, balance }) => {
        map.set(address, balance)
      })
    })

    dispatch(updateSafe({ address: safeAddress, balances }))
  } catch (err) {
    console.error('Error when fetching token balances:', err)
  }
}

export default fetchTokenBalances
