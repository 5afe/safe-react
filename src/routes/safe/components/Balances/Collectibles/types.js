// @flow
export type AssetContractType = 'fungible' | 'non-fungible' | 'semi-fungible' | 'unknown'

export type CollectibleContract = {
  address: string,
  asset_contract_type: AssetContractType,
  created_date: string,
  name: string,
  nft_version: string,
  opensea_version: ?string,
  owner: ?number,
  schema_name: string,
  symbol: string,
  total_supply: ?string,
  description: ?string,
  external_link: ?string,
  image_url: ?string,
  default_to_fiat: boolean,
  dev_buyer_fee_basis_points: number,
  dev_seller_fee_basis_points: number,
  only_proxied_transfers: boolean,
  opensea_buyer_fee_basis_points: number,
  opensea_seller_fee_basis_points: number,
  buyer_fee_basis_points: number,
  seller_fee_basis_points: number,
  payout_address: ?string,
}

export type Range = {
  min: number,
  max: number,
}

export type Traits = {
  cooldown_index: Range,
  generation: Range,
  fancy_ranking: Range,
}

export type Stats = {
  seven_day_volume: number,
  seven_day_change: number,
  total_volume: number,
  count: number,
  num_owners: number,
  market_cap: number,
  average_price: number,
  items_sold: number,
}

export type DisplayData = {
  card_display_style?: ?string,
  images: ?(string[]),
}

export type OpenSeaCollection = {
  primary_asset_contracts?: CollectibleContract[],
  traits?: Traits | {},
  stats?: Stats,
  banner_image_url: ?string,
  chat_url: ?string,
  created_date: string,
  default_to_fiat: boolean,
  description: ?string,
  dev_buyer_fee_basis_points: string,
  dev_seller_fee_basis_points: string,
  display_data: DisplayData,
  external_url: ?string,
  featured: boolean,
  featured_image_url: ?string,
  hidden: boolean,
  image_url: ?string,
  is_subject_to_whitelist: boolean,
  large_image_url: ?string,
  name: string,
  only_proxied_transfers: boolean,
  opensea_buyer_fee_basis_points: string,
  opensea_seller_fee_basis_points: string,
  payout_address: ?string,
  require_email: boolean,
  short_description: ?string,
  slug: string,
  wiki_url: ?string,
  owned_asset_count?: number,
}

export type OpenSeaAccount = {
  user: ?number | string,
  profile_img_url: string,
  address: string,
  config: string,
  discord_id: string,
}

export type OpenSeaTransaction = {
  id: number,
  from_account: OpenSeaAccount,
  to_account: OpenSeaAccount,
  created_date: string,
  modified_date: string,
  transaction_hash: string,
  transaction_index: string,
  block_number: string,
  block_hash: string,
  timestamp: string,
}

export type OpenSeaToken = {
  symbol: string,
  address: string,
  image_url: ?string,
  name: string,
  decimals: number,
  eth_price: string,
  usd_price: string,
}

export type OpenSeaSale = {
  event_type: string,
  auction_type: ?string,
  total_price: string,
  transaction: OpenSeaTransaction,
  payment_token: OpenSeaToken,
}

export type OpenSeaAsset = {
  token_id: string,
  num_sales: number,
  background_color: string,
  image_url: string,
  image_preview_url: string,
  image_thumbnail_url: string,
  image_original_url: string,
  animation_url: ?string,
  animation_original_url: ?string,
  name: string,
  description: string,
  external_link: string,
  asset_contract: CollectibleContract,
  owner: OpenSeaAccount,
  permalink: string,
  collection: OpenSeaCollection,
  decimals: ?(number | string),
  auctions: ?(number | string),
  sell_orders: ?(string[]),
  traits: {}[],
  last_sale: OpenSeaSale,
  top_bid: ?(number | string),
  current_price: ?(number | string),
  current_escrow_price: ?(number | string),
  listing_date: ?string,
  is_presale: boolean,
  transfer_fee_payment_token: ?(number | string),
  transfer_fee: ?(number | string),
}

export type AssetCollectible = {
  tokenId: string,
  title: string,
  text: ?string,
  color: string,
  image: string,
  assetUrl: string,
  description: string,
  order?: ?string,
  assetAddress: string,
  asset: CollectibleContract,
  collection: OpenSeaCollection,
}

export type CollectibleData = {
  image: ?string,
  slug: string,
  title: string,
  data: AssetCollectible[],
}

export type NFTAsset = {
  address: string,
  assetContract: CollectibleContract,
  collection: OpenSeaCollection,
  description: ?string,
  image: ?string,
  name: string,
  numberOfTokens: number,
  slug: string,
  symbol: string,
}

export type NFTToken = {
  assetAddress: string,
  color: ?string,
  description: string,
  image: string,
  name: string,
  tokenId: string,
}

export type NFTAssets = { [key: string]: NFTAsset }

export type CollectiblesInfo = {
  nftAssets: NFTAssets,
  nftTokens: NFTToken[],
}

export interface CollectibleMetadataSource {
  constructor(options: { rps: number }): void;
  fetchAllUserCollectiblesByCategoryAsync(safeAddress: string, networkId: number): Promise<CollectiblesInfo>;
}
