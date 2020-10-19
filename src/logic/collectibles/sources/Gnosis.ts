import { RateLimit } from 'async-sema'

import { Collectibles, NFTAsset, NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/collectibles.d'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import { fetchErc20AndErc721AssetsList, fetchSafeCollectibles } from 'src/logic/tokens/api'
import { TokenResult } from 'src/logic/tokens/api/fetchErc20AndErc721AssetsList'
import { CollectibleResult } from 'src/logic/tokens/api/fetchSafeCollectibles'

type FetchResult = {
  erc721Assets: TokenResult[]
  erc721Tokens: CollectibleResult[]
}

class Gnosis {
  _rateLimit = async (): Promise<void> => {}

  _fetch = async (safeAddress: string): Promise<FetchResult> => {
    const collectibles: FetchResult = {
      erc721Assets: [],
      erc721Tokens: [],
    }

    try {
      const {
        data: { results: assets = [] },
      } = await fetchErc20AndErc721AssetsList()
      collectibles.erc721Assets = assets.filter((token) => token.type.toLowerCase() === 'erc721')
    } catch (e) {
      console.error('no erc721 assets could be fetched', e)
    }

    try {
      const { data: tokens = [] } = await fetchSafeCollectibles(safeAddress)
      collectibles.erc721Tokens = tokens
    } catch (e) {
      console.error('no erc721 tokens for the current safe', e)
    }

    return collectibles
  }

  /**
   * OpenSea class constructor
   * @param {object} options
   * @param {number} options.rps - requests per second
   */
  constructor(options: { rps: number }) {
    // eslint-disable-next-line no-underscore-dangle
    this._rateLimit = RateLimit(options.rps, { timeUnit: 60 * 1000, uniformDistribution: true })
  }

  static extractAssets(assets: TokenResult[], nftTokens: NFTTokens): NFTAssets {
    const extractNFTAsset = (asset: TokenResult): NFTAsset => {
      const numberOfTokens = nftTokens.filter(({ assetAddress }) => assetAddress === asset.address).length

      return {
        address: asset.address,
        description: asset.name,
        image: asset.logoUri || NFTIcon,
        name: asset.name,
        numberOfTokens,
        slug: `${asset.address}_${asset.name}`,
        symbol: asset.symbol,
      }
    }

    return assets.reduce((acc, asset) => {
      const address = asset.address

      if (acc[address] === undefined) {
        acc[address] = extractNFTAsset(asset)
      }

      return acc
    }, {})
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

    return {
      nftTokens,
      nftAssets: Gnosis.extractAssets(erc721Assets, nftTokens),
    }
  }
}

export default Gnosis
