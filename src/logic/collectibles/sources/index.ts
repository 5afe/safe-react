import MockedOpenSea from 'src/logic/collectibles/sources/MockedOpenSea'
import OpenSea from 'src/logic/collectibles/sources/OpenSea'
import Gnosis from 'src/logic/collectibles/sources/Gnosis'
import { COLLECTIBLES_SOURCE } from 'src/utils/constants'

const SOURCES = {
  opensea: new OpenSea({ rps: 4 }),
  gnosis: new Gnosis(),
  mockedopensea: new MockedOpenSea({ rps: 4 }),
}

type Sources = typeof SOURCES

export const getConfiguredSource = (): Sources['opensea'] | Sources['mockedopensea'] | Sources['gnosis'] =>
  SOURCES[COLLECTIBLES_SOURCE.toLowerCase()]
