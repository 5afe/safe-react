// @flow
import { List } from 'immutable'
import { type Token } from '~/logic/tokens/store/model/token'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { isAddressAToken } from '~/logic/tokens/utils/tokenHelpers'
import { simpleMemoize } from '~/components/forms/validator'
// import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'

// eslint-disable-next-line
export const addressIsTokenContract = simpleMemoize(async (tokenAddress: string) => {
  // SECOND APPROACH:
  // They both seem to work the same
  // const tokenContract = await getStandardTokenContract()
  // try {
  //   await tokenContract.at(tokenAddress)
  // } catch {
  //   return 'Not a token address'
  // }

  const isToken = await isAddressAToken(tokenAddress)

  if (!isToken) {
    return 'Not a token address'
  }
})

// eslint-disable-next-line
export const doesntExistInTokenList = (tokenList: List<Token>) =>
  simpleMemoize((tokenAddress: string) => {
    const tokenIndex = tokenList.findIndex(({ address }) => sameAddress(address, tokenAddress))

    if (tokenIndex !== -1) {
      return 'Token already exists in your token list'
    }
  })
