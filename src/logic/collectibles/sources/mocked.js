// @flow
import mockedOpenSea from '~/logic/collectibles/sources/mocked_opensea'
import OpenSea from '~/logic/collectibles/sources/opensea'
import type { CollectibleData, CollectibleMetadataSource } from '~/routes/safe/components/Balances/Collectibles/types'

const kittyAssetContract = {
  address: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
  asset_contract_type: 'non-fungible',
  created_date: '2018-01-23T04:50:03.948541',
  name: 'CryptoKittiesRinkeby',
  nft_version: '1.0',
  opensea_version: null,
  owner: 8995,
  schema_name: 'ERC721',
  symbol: 'KITTYR',
  total_supply: null,
  description: 'The Rinkeby version of CryptoKitties',
  external_link: null,
  image_url: 'https://storage.googleapis.com/opensea-static/cryptokitties-logo.png',
  default_to_fiat: false,
  dev_buyer_fee_basis_points: 0,
  dev_seller_fee_basis_points: 0,
  only_proxied_transfers: false,
  opensea_buyer_fee_basis_points: 0,
  opensea_seller_fee_basis_points: 250,
  buyer_fee_basis_points: 0,
  seller_fee_basis_points: 250,
  payout_address: null,
}

const kittyCollection = {
  banner_image_url: null,
  chat_url: null,
  created_date: '2019-04-26T22:01:15.323664',
  default_to_fiat: false,
  description: 'The Rinkeby version of CryptoKitties',
  dev_buyer_fee_basis_points: '0',
  dev_seller_fee_basis_points: '0',
  display_data: {
    images: [
      'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/52.svg',
      'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/7119.svg',
      'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/7130.svg',
      'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/7125.svg',
      'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/7129.svg',
      'https://user-images.githubusercontent.com/613881/34621969-0afee35a-f200-11e7-99a9-86088f2aabfe.png',
    ],
  },
  external_url: null,
  featured: true,
  featured_image_url: 'https://storage.googleapis.com/opensea-static/Category-Thumb-CryptoKittes.png',
  hidden: false,
  image_url: 'https://storage.googleapis.com/opensea-static/cryptokitties-logo.png',
  is_subject_to_whitelist: false,
  large_image_url: null,
  name: 'CryptoKittiesRinkeby',
  only_proxied_transfers: false,
  opensea_buyer_fee_basis_points: '0',
  opensea_seller_fee_basis_points: '250',
  payout_address: null,
  require_email: false,
  short_description: null,
  slug: 'cryptokittiesrinkeby',
  wiki_url: null,
}

const allCollectibles: CollectibleData[] = [
  {
    image: 'https://storage.googleapis.com/opensea-static/cryptokitties-logo.png',
    slug: kittyCollection.slug,
    title: 'CryptoKittiesRinkeby',
    data: [
      {
        tokenId: '0',
        title: 'Glitter',
        text: 'Glitter',
        order: null,
        color: '#F6FEFC',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
        collection: kittyCollection,
      },
      {
        tokenId: '1',
        title: 'Furbeard',
        text: 'Furbeard',
        order: null,
        color: '#F6C68A',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/9_xunbhn.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
        collection: kittyCollection,
      },
      {
        tokenId: '2',
        title: 'Glasswalker',
        text: 'Glasswalker',
        order: null,
        color: '#CAFAF7',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/10_iqm4un.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
        collection: kittyCollection,
      },
      {
        tokenId: '3',
        title: 'Ande',
        text: 'Ande',
        order: null,
        color: '#B8F1B9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888667/5_sxqrol.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
        collection: kittyCollection,
      },
      {
        tokenId: '4',
        title: 'Squib',
        text: 'Squib',
        order: null,
        color: '#CFD4F9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888664/1_sz6sji.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
        collection: kittyCollection,
      },
      {
        tokenId: '10',
        title: 'Negato',
        text: 'Negato',
        order: null,
        color: '#D7BBF3',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888661/8_qjebni.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
        collection: kittyCollection,
      },
      {
        tokenId: '11',
        title: 'DuCat',
        text: 'DuCat',
        order: null,
        color: '#D6DDD8',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888654/2_yndavu.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
        collection: kittyCollection,
      },
      {
        tokenId: '12',
        title: 'Berry',
        text: 'Berry',
        order: null,
        color: '#F7B4D5',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888653/4_do9hzd.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
        collection: kittyCollection,
      },
    ],
  },
]

export class MockedOpenSea extends OpenSea {
  _fetch = async () => {
    await this._rateLimit()
    return { json: () => mockedOpenSea }
  }
}

class Mocked implements CollectibleMetadataSource {
  async fetchAllUserCollectiblesByCategoryAsync(): Promise<CollectibleData[]> {
    return allCollectibles
  }
}

export default Mocked
