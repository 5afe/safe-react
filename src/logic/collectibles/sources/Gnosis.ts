import { Collectibles, NFTAsset, NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/collectibles.d'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import { fetchSafeCollectibles } from 'src/logic/tokens/api'
import { TokenResult } from 'src/logic/tokens/api/fetchErc20AndErc721AssetsList'
import { CollectibleResult } from 'src/logic/tokens/api/fetchSafeCollectibles'
import { TokenType } from 'src/logic/safe/store/models/types/gateway.d'

type FetchResult = {
  erc721Assets: TokenResult[]
  erc721Tokens: CollectibleResult[]
}
class Gnosis {
  _getAssetsFromTokens = (tokens: CollectibleResult[]): TokenResult[] => {
    const assets: TokenResult[] = tokens.map(({ address, logoUri, tokenName, tokenSymbol }) => ({
      address,
      decimals: undefined,
      logoUri,
      name: tokenName,
      symbol: tokenSymbol,
      type: 'ERC721' as TokenType,
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
      collectibles.erc721Assets = this._getAssetsFromTokens(tokens.data)
      collectibles.erc721Tokens = tokens.data || []
    } catch (error) {
      console.error('no erc721 tokens for the current safe', error)
    }

    return collectibles
  }

  static extractNFTAsset = (asset: TokenResult, nftTokens: NFTTokens): NFTAsset => {
    const mainAssetAddress = asset.address
    const numberOfTokens = nftTokens.filter(({ assetAddress }) => sameAddress(assetAddress, mainAssetAddress)).length

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

  static extractTokens(tokens: CollectibleResult[]): NFTTokens {
    return tokens.map((token) => ({
      assetAddress: token.address,
      color: 'red',
      description: token.description || '',
      image: token.imageUri || NFTIcon,
      name: token.name || '',
      tokenId: token.id,
    }))
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
