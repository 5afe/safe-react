import { RateLimit } from 'async-sema'

import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import { OPENSEA_API_KEY } from 'src/utils/constants'

export interface OpenSeaAssetContract {
  address: string
  name: string
  image_url: string
  symbol: string
}

export interface OpenSeaCollection {
  name: string
  slug: string
}

export interface OpenSeaAsset {
  asset_contract: OpenSeaAssetContract
  background_color: string
  collection: OpenSeaCollection
  description: string
  image_thumbnail_url: string
  name: string
  token_id: string
}

export type OpenSeaAssets = Array<OpenSeaAsset>

export interface NFTAsset {
  address: string
  assetContract: OpenSeaAssetContract
  collection: OpenSeaCollection
  description: string
  image: string
  name: string
  numberOfTokens: number
  slug: string
  symbol: string
}
export type NFTAssets = Record<string, NFTAsset>

export interface NFTToken {
  assetAddress: string
  color: string
  description: string
  image: string
  name: string
  tokenId: number | string
}
export type NFTTokens = Array<NFTToken>

export interface Collectibles {
  nftAssets: NFTAssets
  nftTokens: NFTTokens
}

class OpenSea {
  _rateLimit = async () => {}

  _endpointsUrls = {
    [ETHEREUM_NETWORK.MAINNET]: 'https://api.opensea.io/api/v1',
    [ETHEREUM_NETWORK.RINKEBY]: 'https://rinkeby-api.opensea.io/api/v1',
  }

  _fetch = async (url) => {
    // eslint-disable-next-line no-underscore-dangle
    return fetch(url, {
      headers: { 'X-API-KEY': OPENSEA_API_KEY || '' },
    })
  }

  /**
   * OpenSea class constructor
   * @param {object} options
   * @param {number} options.rps - requests per second
   */
  constructor(options) {
    // eslint-disable-next-line no-underscore-dangle
    this._rateLimit = RateLimit(options.rps, { timeUnit: 60 * 1000, uniformDistribution: true })
  }

  static extractAssets(assets: OpenSeaAssets): NFTAssets {
    const extractNFTAsset = (asset) => ({
      address: asset.asset_contract.address,
      assetContract: asset.asset_contract,
      collection: asset.collection,
      description: asset.asset_contract.name,
      image: asset.asset_contract.image_url || NFTIcon,
      name: asset.collection.name,
      numberOfTokens: 1,
      slug: asset.collection.slug,
      symbol: asset.asset_contract.symbol,
    })

    return assets.reduce((acc, asset) => {
      const address = asset.asset_contract.address

      if (acc[address] === undefined) {
        acc[address] = extractNFTAsset(asset)
      } else {
        // By default, extractNFTAsset sets `numberOfTokens` to 1,
        // counting the asset recently processed.
        // If it happens to already exist the asset in the map,
        // then we just increment the `numberOfTokens` value by 1.
        acc[address].numberOfTokens = acc[address].numberOfTokens + 1
      }

      return acc
    }, {})
  }

  static extractTokens(assets: OpenSeaAssets): NFTTokens {
    return assets.map((asset) => ({
      assetAddress: asset.asset_contract.address,
      color: asset.background_color,
      description: asset.description,
      image: asset.image_thumbnail_url || NFTIcon,
      name: asset.name || `${asset.asset_contract.name} - #${asset.token_id}`,
      tokenId: asset.token_id,
    }))
  }

  static extractCollectiblesInfo(assetResponseJson: { assets: OpenSeaAssets }): Collectibles {
    return {
      nftAssets: OpenSea.extractAssets(assetResponseJson.assets),
      nftTokens: OpenSea.extractTokens(assetResponseJson.assets),
    }
  }

  /**
   * Fetches from OpenSea the list of collectibles, grouped by category,
   * for the provided Safe Address in the specified Network
   * @param {string} safeAddress
   * @param {string} network
   * @returns {Promise<Collectibles>}
   */
  async fetchAllUserCollectiblesByCategoryAsync(safeAddress: string, network: string): Promise<Collectibles> {
    // eslint-disable-next-line no-underscore-dangle
    const metadataSourceUrl = this._endpointsUrls[network]
    const url = `${metadataSourceUrl}/assets/?owner=${safeAddress}`
    // eslint-disable-next-line no-underscore-dangle
    const assetsResponse = await this._fetch(url)
    const assetsResponseJson = await assetsResponse.json()
    return OpenSea.extractCollectiblesInfo(assetsResponseJson)
  }
}

export default OpenSea
