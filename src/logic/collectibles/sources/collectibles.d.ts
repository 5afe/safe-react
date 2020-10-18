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
  assetContract?: OpenSeaAssetContract
  collection?: OpenSeaCollection
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
