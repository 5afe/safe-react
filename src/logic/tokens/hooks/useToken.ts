import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { fetchToken } from 'src/logic/tokens/store/actions/fetchToken'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { Token } from 'src/logic/tokens/store/model/token'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { nftAssetsListSelector } from 'src/logic/collectibles/store/selectors'
import { NFTAsset } from 'src/logic/collectibles/sources/OpenSea'

export const useToken = (tokenAddress: string): Token | NFTAsset | undefined => {
  const tokens = useSelector(tokensSelector)
  const assets = useSelector(nftAssetsListSelector)
  const dispatch = useDispatch()

  const token = useMemo(() => {
    if (tokenAddress === ETH_ADDRESS) {
      return getEthAsToken('0')
    }
    return tokens.get(tokenAddress) || assets.find((asset) => asset.address === tokenAddress)
  }, [assets, tokenAddress, tokens])

  useEffect(() => {
    if (!token) {
      dispatch(fetchToken(tokenAddress))
    }
  }, [dispatch, tokenAddress, tokens, assets, token])

  return token
}
