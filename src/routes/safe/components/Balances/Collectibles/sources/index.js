// @flow

import Mocked, { MockedOpenSea } from './mocked'
import OpenSea from './opensea'

import type { CollectibleMetadataSource } from '~/routes/safe/components/Balances/Collectibles/types'
import { COLLECTIBLES_SOURCE } from '~/utils/constants'

const sources: { [key: string]: CollectibleMetadataSource } = {
  opensea: new OpenSea({ rps: 5 }),
  mocked: new Mocked(),
  mockedopensea: new MockedOpenSea({ rps: 5 }),
}

export const getConfiguredSource = () => sources[COLLECTIBLES_SOURCE.toLowerCase()]
