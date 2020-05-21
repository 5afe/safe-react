import MockedOpenSea from 'src/logic/collectibles/sources/MockedOpenSea'
import OpenSea from 'src/logic/collectibles/sources/OpenSea'
import { COLLECTIBLES_SOURCE } from 'src/utils/constants'

const sources = {
  opensea: new OpenSea({ rps: 4 }),
  mockedopensea: new MockedOpenSea({ rps: 4 }),
}

export const getConfiguredSource = () => sources[COLLECTIBLES_SOURCE.toLowerCase()]
