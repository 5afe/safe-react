import Gnosis from 'src/logic/collectibles/sources/Gnosis'
import { COLLECTIBLES_SOURCE } from 'src/utils/constants'

const SOURCES = {
  gnosis: new Gnosis(),
}

type Sources = typeof SOURCES

export const getConfiguredSource = (): Sources['gnosis'] => SOURCES[COLLECTIBLES_SOURCE.toLowerCase()]
