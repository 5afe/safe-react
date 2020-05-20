import { simpleMemoize } from 'src/components/forms/validator'

import { isAddressAToken } from 'src/logic/tokens/utils/tokenHelpers'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
// import { getStandardTokenContract } from 'src/logic/tokens/store/actions/fetchTokens'

// eslint-disable-next-line
export const addressIsTokenContract = simpleMemoize(async (tokenAddress) => {
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
export const doesntExistInTokenList = (tokenList) =>
  simpleMemoize((tokenAddress) => {
    const tokenIndex = tokenList.findIndex(({ address }) => sameAddress(address, tokenAddress))

    if (tokenIndex !== -1) {
      return 'Token already exists in your token list'
    }
  })
