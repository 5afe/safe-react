import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ERC20Detailed from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import { fetchToken } from 'src/logic/tokens/api'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { ETH_ADDRESS, getERC721Symbol, isERC721Contract } from '../utils/tokenHelpers'
import etherLogo from 'src/assets/icons/icon_etherTokens.svg'
import { addToken } from '../store/actions/addToken'
import { nftAssetsListSelector } from 'src/logic/collectibles/store/selectors'
import { NFTAsset } from 'src/logic/collectibles/sources/OpenSea'
import { fetchCollectible } from 'src/logic/collectibles/api/fetchCollectible'
import { addNftAsset } from 'src/logic/collectibles/store/actions/addCollectible'

const getTokenInfoFromBlockchain = (tokenAddress: string): string[] =>
  generateBatchRequests({
    abi: ERC20Detailed.abi,
    address: tokenAddress,
    methods: ['decimals', 'name', 'symbol'],
  })

export const useToken = (tokenAddress: string, isCustomToken = false): Token | NFTAsset => {
  const [token, setToken] = useState<Token | NFTAsset | null>(null)
  const tokens = useSelector(tokensSelector)
  const assets = useSelector(nftAssetsListSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchTokenInfo = async () => {
      // Custom token won't be on the backend, we dont try to fetch if in order to improve the performance
      const remoteToken = !isCustomToken ? await fetchToken(tokenAddress) : null
      if (remoteToken) {
        const { address, decimals, symbol, logoUri, name } = remoteToken

        if (!decimals) {
          return
        }

        const tokenProps = {
          address,
          name: name || symbol,
          symbol: symbol,
          decimals: Number(decimals),
          logoUri,
        }
        setToken(makeToken(tokenProps))
        if (!isCustomToken) {
          dispatch(addToken(tokenProps))
        }
      } else {
        const [tokenDecimals, tokenName, tokenSymbol] = await getTokenInfoFromBlockchain(tokenAddress)
        if (tokenDecimals === null) {
          return null
        }
        const tokenProps = {
          address: tokenAddress,
          name: tokenName ? tokenName : tokenSymbol,
          symbol: tokenSymbol,
          decimals: Number(tokenDecimals),
          logoUri: '',
        }
        setToken(makeToken(tokenProps))
        if (!isCustomToken) {
          dispatch(addToken(tokenProps))
        }
      }
    }

    const fetchAssetInfo = async () => {
      // Custom token won't be on the backend, we dont try to fetch if in order to improve the performance
      const remoteAsset = !isCustomToken ? await fetchCollectible(tokenAddress) : null
      if (remoteAsset) {
        const assetsProps = {
          ...remoteAsset,
        }

        setToken(assetsProps)
        if (!isCustomToken) {
          dispatch(addNftAsset(assetsProps))
        }
      } else {
        const symbol = await getERC721Symbol(tokenAddress)

        const assetsProps = {
          address: tokenAddress,
          symbol,
          assetContract: null,
          collection: null,
          description: '',
          image: '',
          name: '',
          numberOfTokens: 0,
          slug: '',
        }

        setToken(assetsProps)
        if (!isCustomToken) {
          dispatch(addNftAsset(assetsProps))
        }
      }
    }

    const fetchAssetOrTokenInfo = async () => {
      const isERC721 = await isERC721Contract(tokenAddress)
      if (isERC721) {
        fetchAssetInfo()
      } else {
        fetchTokenInfo()
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
      const localAsset = assets.find((asset) => asset.address === tokenAddress)

      if (localToken) {
        setToken(localToken)
      } else if (localAsset) {
        setToken(localAsset)
      } else {
        fetchAssetOrTokenInfo()
      }
    }
  }, [dispatch, isCustomToken, tokenAddress, tokens, assets])

  return token
}
