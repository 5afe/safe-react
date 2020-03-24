// @flow
import MockedOpenSea from '~/logic/collectibles/sources/MockedOpenSea'
import OpenSea from '~/logic/collectibles/sources/OpenSea'
import type { CollectibleMetadataSource } from '~/routes/safe/components/Balances/Collectibles/types'
import { COLLECTIBLES_SOURCE } from '~/utils/constants'

const sources: { [key: string]: CollectibleMetadataSource } = {
  opensea: new OpenSea({ rps: 4 }),
  mockedopensea: new MockedOpenSea({ rps: 4 }),
}

export const getConfiguredSource = () => sources[COLLECTIBLES_SOURCE.toLowerCase()]
