// @flow
import { List } from 'immutable'

import { simpleMemoize } from '~/components/forms/validator'
import { isERC721Contract } from '~/logic/tokens/utils/tokenHelpers'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import type { NFTAsset } from '~/routes/safe/components/Balances/Collectibles/types'

// eslint-disable-next-line
export const addressIsAssetContract = simpleMemoize(async (tokenAddress: string) => {
  const isAsset = await isERC721Contract(tokenAddress)
  if (!isAsset) {
    return 'Not a asset address'
  }
})

// eslint-disable-next-line
export const doesntExistInAssetsList = (assetsList: List<NFTAsset>) =>
  simpleMemoize((tokenAddress: string) => {
    const tokenIndex = assetsList.findIndex(({ address }) => sameAddress(address, tokenAddress))

    if (tokenIndex !== -1) {
      return 'Token already exists in your token list'
    }
  })
