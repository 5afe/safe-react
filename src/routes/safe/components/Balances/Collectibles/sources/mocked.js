// @flow
import type {
  CollectibleData,
  CollectibleMetadataSource,
} from '~/routes/safe/components/Balances/Collectibles/types'
import OpenSea from '~/routes/safe/components/Balances/Collectibles/sources/opensea'
import mockedOpenSea from '~/routes/safe/components/Balances/Collectibles/sources/mocked_opensea'

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
  image_url:
    'https://storage.googleapis.com/opensea-static/cryptokitties-logo.png',
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

const allCollectibles: CollectibleData[] = [
  {
    image:
      'https://storage.googleapis.com/opensea-static/cryptokitties-logo.png',
    title: 'CryptoKittiesRinkeby',
    data: [
      {
        tokenId: '0',
        title: 'Glitter',
        text: 'Glitter',
        order: null,
        color: '#F6FEFC',
        image:
          'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
      },
      {
        tokenId: '1',
        title: 'Furbeard',
        text: 'Furbeard',
        order: null,
        color: '#F6C68A',
        image:
          'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/9_xunbhn.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
      },
      {
        tokenId: '2',
        title: 'Glasswalker',
        text: 'Glasswalker',
        order: null,
        color: '#CAFAF7',
        image:
          'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/10_iqm4un.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
      },
      {
        tokenId: '3',
        title: 'Ande',
        text: 'Ande',
        order: null,
        color: '#B8F1B9',
        image:
          'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888667/5_sxqrol.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
      },
      {
        tokenId: '4',
        title: 'Squib',
        text: 'Squib',
        order: null,
        color: '#CFD4F9',
        image:
          'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888664/1_sz6sji.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
      },
      {
        tokenId: '10',
        title: 'Negato',
        text: 'Negato',
        order: null,
        color: '#D7BBF3',
        image:
          'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888661/8_qjebni.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
      },
      {
        tokenId: '11',
        title: 'DuCat',
        text: 'DuCat',
        order: null,
        color: '#D6DDD8',
        image:
          'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888654/2_yndavu.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
      },
      {
        tokenId: '12',
        title: 'Berry',
        text: 'Berry',
        order: null,
        color: '#F7B4D5',
        image:
          'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888653/4_do9hzd.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        assetAddress: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
        asset: kittyAssetContract,
      },
    ],
  },
]

export class MockedOpenSea extends OpenSea {
  _fetch = async () => {
    return { json: () => mockedOpenSea }
  }
}

class Mocked implements CollectibleMetadataSource {
  async fetchAllUserCollectiblesAsync(): Promise<CollectibleData[]> {
    return allCollectibles
  }
}

export default Mocked
