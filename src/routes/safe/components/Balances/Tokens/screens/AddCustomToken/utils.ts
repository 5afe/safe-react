import { getHumanFriendlyToken } from 'src/logic/tokens/store/actions/fetchTokens'

export const getSymbolAndDecimalsFromContract = async (tokenAddress) => {
  const tokenContract = await getHumanFriendlyToken()
  const token = await tokenContract.at(tokenAddress)
  let values

  try {
    const [symbol, decimals] = await Promise.all([token.symbol(), token.decimals()])
    values = [symbol, decimals.toString()]
  } catch {
    values = []
  }

  return values
}
