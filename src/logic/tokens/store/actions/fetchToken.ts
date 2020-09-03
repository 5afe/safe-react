import { Dispatch } from 'redux'
import ERC20Detailed from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { makeToken } from 'src/logic/tokens/store/model/token'
import { fetchToken as fetchTokenInfo } from 'src/logic/tokens/api'
import { addToken } from './addToken'

const getTokenInfoFromBlockchain = (tokenAddress: string): string[] =>
  generateBatchRequests({
    abi: ERC20Detailed.abi,
    address: tokenAddress,
    methods: ['decimals', 'name', 'symbol'],
  })

export const fetchToken = (tokenAddress: string) => async (dispatch: Dispatch): Promise<void> => {
  try {
    const remoteToken = await fetchTokenInfo(tokenAddress)

    if (remoteToken) {
      const tokenProps = {
        ...remoteToken,
        name: remoteToken.name || remoteToken.symbol,
      }

      dispatch(addToken(makeToken(tokenProps)))
    } else {
      const [tokenDecimals, tokenName, tokenSymbol] = await getTokenInfoFromBlockchain(tokenAddress)

      if (!tokenDecimals) {
        return
      }

      const tokenProps = {
        address: tokenAddress,
        name: tokenName ? tokenName : tokenSymbol,
        symbol: tokenSymbol,
        decimals: Number(tokenDecimals),
        logoUri: '',
      }

      dispatch(addToken(makeToken(tokenProps)))
    }
  } catch (err) {
    console.error(`Error fetching a token with address ${tokenAddress}`, err)
  }
}
