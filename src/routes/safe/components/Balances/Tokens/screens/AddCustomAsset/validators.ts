import { simpleMemoize } from 'src/components/forms/validator'
import { isERC721Contract } from 'src/logic/tokens/utils/tokenHelpers'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

// eslint-disable-next-line
export const addressIsAssetContract = simpleMemoize(async (tokenAddress) => {
  const isAsset = await isERC721Contract(tokenAddress)
  if (!isAsset) {
    return 'Not a asset address'
  }
})

// eslint-disable-next-line
export const doesntExistInAssetsList = (assetsList) =>
  simpleMemoize((tokenAddress) => {
    const tokenIndex = assetsList.findIndex(({ address }) => sameAddress(address, tokenAddress))

    if (tokenIndex !== -1) {
      return 'Token already exists in your token list'
    }
  })
