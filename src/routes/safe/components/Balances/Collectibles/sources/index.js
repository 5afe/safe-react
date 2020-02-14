// @flow
import { COLLECTIBLES_SOURCE } from '~/utils/constants'
import type { CollectibleMetadataSource } from '~/routes/safe/components/Balances/Collectibles/types'

import Mocked from './mocked'
import OpenSea from './opensea'

const sources: { [key: string]: CollectibleMetadataSource } = {
  opensea: new OpenSea({ rps: 5 }),
  mocked: new Mocked(),
}

export const getConfiguredSource = () =>
  sources[COLLECTIBLES_SOURCE.toLowerCase()]
