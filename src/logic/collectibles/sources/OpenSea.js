// @flow
import { RateLimit } from 'async-sema'

import type {
  CollectibleMetadataSource,
  CollectiblesInfo,
  NFTAsset,
  NFTAssets,
  NFTToken,
  OpenSeaAsset,
} from '~/routes/safe/components/Balances/Collectibles/types'
import NFTIcon from '~/routes/safe/components/Balances/assets/nft_icon.png'
import { OPENSEA_API_KEY } from '~/utils/constants'

class OpenSea implements CollectibleMetadataSource {
  _rateLimit = async () => {}

  _endpointsUrls: { [key: number]: string } = {
    // $FlowFixMe
    1: 'https://api.opensea.io/api/v1',
    // $FlowFixMe
    4: 'https://rinkeby-api.opensea.io/api/v1',
  }

  _fetch = async (url: string) => {
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
  constructor(options: { rps: number }) {
    // eslint-disable-next-line no-underscore-dangle
    this._rateLimit = RateLimit(options.rps, { timeUnit: 60 * 1000, uniformDistribution: true })
  }

  static extractAssets(assets: OpenSeaAsset[]): NFTAssets {
    const extractNFTAsset = (asset): NFTAsset => ({
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

    return assets.reduce((acc: NFTAssets, asset: OpenSeaAsset) => {
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

  static extractTokens(assets: OpenSeaAsset[]): NFTToken[] {
    return assets.map((asset: OpenSeaAsset): NFTToken => ({
      assetAddress: asset.asset_contract.address,
      color: asset.background_color,
      description: asset.description,
      image: asset.image_thumbnail_url || NFTIcon,
      name: asset.name || `${asset.asset_contract.name} - #${asset.token_id}`,
      tokenId: asset.token_id,
    }))
  }

  static extractCollectiblesInfo(assetResponseJson: { assets: OpenSeaAsset[] }): CollectiblesInfo {
    return {
      nftAssets: OpenSea.extractAssets(assetResponseJson.assets),
      nftTokens: OpenSea.extractTokens(assetResponseJson.assets),
    }
  }

  /**
   * Fetches from OpenSea the list of collectibles, grouped by category,
   * for the provided Safe Address in the specified Network
   * @param {string} safeAddress
   * @param {number} networkId
   * @returns {Promise<{ nftAssets: Map<string, NFTAsset>, nftTokens: Array<NFTToken> }>}
   */
  async fetchAllUserCollectiblesByCategoryAsync(safeAddress: string, networkId: number) {
    // eslint-disable-next-line no-underscore-dangle
    const metadataSourceUrl = this._endpointsUrls[networkId]
    const url = `${metadataSourceUrl}/assets/?owner=${safeAddress}`
    // eslint-disable-next-line no-underscore-dangle
    const assetsResponse = await this._fetch(url)
    const assetsResponseJson = await assetsResponse.json()
    return OpenSea.extractCollectiblesInfo(assetsResponseJson)
  }
}

export default OpenSea
