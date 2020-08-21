import { getNetwork } from 'src/config'
import { getConfiguredSource } from 'src/logic/collectibles/sources'

import { NFTAsset } from '../sources/OpenSea'

export const fetchCollectible = async (collectibleAddress: string): Promise<NFTAsset | null> => {
  try {
    const network = getNetwork()
    const source = getConfiguredSource()
    return await source.fetchCollectibleByAddress(collectibleAddress, network)
  } catch (error) {
    console.log('Error fetching collectibles:', error)
  }
  return null
}
