import MockedOpenSea from 'src/logic/collectibles/sources/MockedOpenSea'
import OpenSea from 'src/logic/collectibles/sources/OpenSea'
import { COLLECTIBLES_SOURCE } from 'src/utils/constants'

const SOURCES = {
  opensea: new OpenSea({ rps: 4 }),
  mockedopensea: new MockedOpenSea({ rps: 4 }),
}

type Sources = typeof SOURCES

export const getConfiguredSource = (): Sources['opensea'] | Sources['mockedopensea'] =>
  SOURCES[COLLECTIBLES_SOURCE.toLowerCase()]
