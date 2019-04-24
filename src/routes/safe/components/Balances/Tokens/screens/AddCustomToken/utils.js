// @flow
import { getHumanFriendlyToken } from '~/logic/tokens/store/actions/fetchTokens'

export const getSymbolAndDecimalsFromContract = async (tokenAddress: string) => {
  const tokenContract = await getHumanFriendlyToken()
  const token = await tokenContract.at(tokenAddress)
  let values

  try {
    values = await Promise.all([token.symbol(), (await token.decimals()).toString()])
  } catch {
    values = []
  }

  return values
}
