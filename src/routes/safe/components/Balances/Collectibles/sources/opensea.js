// @flow
import { RateLimit } from 'async-sema'

import { ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import type {
  AssetCollectible,
  CollectibleData,
  CollectibleMetadataSource,
  OpenSeaAsset,
} from '~/routes/safe/components/Balances/Collectibles/types'
import { OPENSEA_API_KEY } from '~/utils/constants'

type GroupedCollectibles = {
  [key: string]: AssetCollectible[],
}

class OpenSea implements CollectibleMetadataSource {
  _rateLimit = async () => {}

  _endpointsUrls: { [key: string]: string } = {
    [ETHEREUM_NETWORK.MAINNET]: 'https://api.opensea.io/api/v1',
    [ETHEREUM_NETWORK.RINKEBY]: 'https://rinkeby-api.opensea.io/api/v1',
  }

  _fetch = async (url: string) => {
    // eslint-disable-next-line no-underscore-dangle
    await this._rateLimit()
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
    this._rateLimit = RateLimit(options.rps)
  }

  static getAssetsAsCollectible(assets: OpenSeaAsset[]): AssetCollectible[] {
    return assets.map(asset => OpenSea.getAssetAsCollectible(asset))
  }

  static getAssetAsCollectible(asset: OpenSeaAsset): AssetCollectible {
    return {
      tokenId: asset.token_id,
      title: asset.name || `${asset.asset_contract.name} - #${asset.token_id}`,
      text: asset.description,
      color: asset.background_color ? `#${asset.background_color}` : '',
      image: asset.image_url,
      assetUrl: asset.external_link,
      description: asset.name,
      order: null,
      assetAddress: asset.asset_contract.address,
      asset: asset.asset_contract,
      collection: asset.collection,
    }
  }

  static groupCollectibles(assetsResponseJson: { assets: OpenSeaAsset[] }) {
    const groupedCollectibles: GroupedCollectibles = OpenSea.getAssetsAsCollectible(assetsResponseJson.assets).reduce(
      (acc, el) => {
        const family = acc[el.assetAddress]

        if (family) {
          acc[el.assetAddress] = [...family, el]
        } else {
          acc[el.assetAddress] = [el]
        }

        return acc
      },
      {},
    )

    return Object.keys(groupedCollectibles).map<CollectibleData>(collectibleAddress => {
      const collectibles = groupedCollectibles[collectibleAddress]
      const { image_url: image, name: title } = collectibles[0].asset
      const { name: collectionTitle, slug } = collectibles[0].collection

      return {
        image,
        slug,
        title: title
          .toLowerCase()
          .trim()
          .startsWith('unidentified')
          ? collectionTitle
          : title,
        data: collectibles,
      }
    })
  }

  /**
   * Fetches from OpenSea the list of collectibles, grouped by category,
   * for the provided Safe Address in the specified Network
   * @param {string} safeAddress
   * @param {string} networkName
   * @returns {Promise<Array<CollectibleData>>}
   */
  async fetchAllUserCollectiblesByCategoryAsync(safeAddress: string, networkName: string) {
    // eslint-disable-next-line no-underscore-dangle
    const metadataSourceUrl = this._endpointsUrls[networkName]
    const url = `${metadataSourceUrl}/assets/?owner=${safeAddress}`
    // eslint-disable-next-line no-underscore-dangle
    const assetsResponse = await this._fetch(url)
    const assetsResponseJson = await assetsResponse.json()
    return OpenSea.groupCollectibles(assetsResponseJson)
  }
}

export default OpenSea
