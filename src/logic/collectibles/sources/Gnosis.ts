import { SafeCollectibleResponse, TokenType } from '@gnosis.pm/safe-react-gateway-sdk'

import { Collectibles, NFTAsset, NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/collectibles.d'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import { fetchSafeCollectibles } from 'src/logic/tokens/api/fetchSafeCollectibles'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

type TokenResult = {
  address: string
  decimals?: number
  logoUri: string
  name: string
  symbol: string
  type: TokenType
}

type FetchResult = {
  erc721Assets: TokenResult[]
  erc721Tokens: SafeCollectibleResponse[]
}
class Gnosis {
  _getAssetsFromTokens = (tokens: SafeCollectibleResponse[]): TokenResult[] => {
    const assets: TokenResult[] = tokens.map(({ address, logoUri, tokenName, tokenSymbol }) => ({
      address,
      decimals: undefined,
      logoUri,
      name: tokenName,
      symbol: tokenSymbol,
      type: TokenType.ERC721,
    }))

    return assets
  }

  _fetch = async (safeAddress: string): Promise<FetchResult> => {
    const collectibles: FetchResult = {
      erc721Assets: [],
      erc721Tokens: [],
    }

    try {
      const tokens = await fetchSafeCollectibles(safeAddress)
      collectibles.erc721Assets = this._getAssetsFromTokens(tokens)
      collectibles.erc721Tokens = tokens || []
    } catch (error) {
      logError(Errors._604, error.message)
    }

    return collectibles
  }

  static extractNFTAsset = (asset: TokenResult, nftTokens: NFTTokens): NFTAsset => {
    const mainAssetAddress = asset.address
    const numberOfTokens = nftTokens.items.filter(({ assetAddress }) =>
      sameAddress(assetAddress, mainAssetAddress),
    ).length

    return {
      address: mainAssetAddress,
      description: asset.name,
      image: asset.logoUri || NFTIcon,
      name: asset.name,
      numberOfTokens,
      slug: `${mainAssetAddress}_${asset.name}`,
      symbol: asset.symbol,
    }
  }

  static extractAssets(assets: TokenResult[], nftTokens: NFTTokens): NFTAssets {
    const extractedAssets = {}

    assets.forEach((asset) => {
      const address = asset.address

      if (extractedAssets[address] === undefined) {
        extractedAssets[address] = Gnosis.extractNFTAsset(asset, nftTokens)
      }
    })

    return extractedAssets
  }

  static extractTokens(tokens: SafeCollectibleResponse[]): NFTTokens {
    const items = tokens.map((token) => ({
      assetAddress: token.address,
      color: 'red',
      description: token.description || '',
      image: token.imageUri || NFTIcon,
      name: token.name || '',
      tokenId: token.id,
    }))
    return { items, loaded: true }
  }

  /**
   * Fetches from OpenSea the list of collectibles, grouped by category,
   * for the provided Safe Address in the specified Network
   * @param {string} safeAddress
   * @returns {Promise<Collectibles>}
   */
  async fetchCollectibles(safeAddress: string): Promise<Collectibles> {
    const { erc721Assets, erc721Tokens } = await this._fetch(safeAddress)

    const nftTokens = Gnosis.extractTokens(erc721Tokens)
    const nftAssets = Gnosis.extractAssets(erc721Assets, nftTokens)

    return { nftTokens, nftAssets }
  }
}

export default Gnosis
