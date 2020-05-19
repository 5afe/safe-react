import OpenSea from 'src/logic/collectibles/sources/OpenSea'
import mockedOpenSea from './mocked_opensea.json'

class MockedOpenSea extends OpenSea {
  _fetch: any = async () => {
    await this._rateLimit()
    return { json: () => mockedOpenSea }
  }
}

export default MockedOpenSea
