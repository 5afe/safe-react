// 
import MockedOpenSea from 'logic/collectibles/sources/MockedOpenSea'
import OpenSea from 'logic/collectibles/sources/OpenSea'
import { COLLECTIBLES_SOURCE } from 'utils/constants'

const sources = {
  opensea: new OpenSea({ rps: 4 }),
  mockedopensea: new MockedOpenSea({ rps: 4 }),
}

export const getConfiguredSource = () => sources[COLLECTIBLES_SOURCE.toLowerCase()]
