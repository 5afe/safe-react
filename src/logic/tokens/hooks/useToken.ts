import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ERC20Detailed from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import { fetchToken } from 'src/logic/tokens/api'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { ETH_ADDRESS } from '../utils/tokenHelpers'
import etherLogo from 'src/assets/icons/icon_etherTokens.svg'

const getTokenInfoFromBlockchain = (tokenAddress: string): string[] =>
  generateBatchRequests({
    abi: ERC20Detailed.abi,
    address: tokenAddress,
    methods: ['decimals', 'name', 'symbol'],
  })

export const useToken = (tokenAddress: string): Token | null => {
  const [token, setToken] = useState<Token | null>(null)
  const tokens = useSelector(tokensSelector)

  useEffect(() => {
    const fetchTokenInfo = async () => {
      const remoteToken = await fetchToken(tokenAddress)
      if (remoteToken) {
        const { address, decimals, symbol, logoUri, name } = remoteToken

        if (!decimals) {
          return
        }

        setToken(
          makeToken({
            address,
            name: name || symbol,
            symbol: symbol,
            decimals: Number(decimals),
            logoUri,
          }),
        )
      } else {
        const [tokenDecimals, tokenName, tokenSymbol] = await getTokenInfoFromBlockchain(tokenAddress)
        if (tokenDecimals === null) {
          return null
        }
        setToken(
          makeToken({
            address: tokenAddress,
            name: tokenName ? tokenName : tokenSymbol,
            symbol: tokenSymbol,
            decimals: Number(tokenDecimals),
            logoUri: '',
          }),
        )
      }
    }

    if (tokenAddress === ETH_ADDRESS) {
      setToken(
        makeToken({
          address: ETH_ADDRESS,
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          logoUri: etherLogo,
        }),
      )
      return
    }

    if (tokenAddress) {
      const localToken = tokens.get(tokenAddress)

      if (localToken) {
        setToken(localToken)
      } else {
        fetchTokenInfo()
      }
    }
  }, [tokenAddress, tokens])

  return token
}
