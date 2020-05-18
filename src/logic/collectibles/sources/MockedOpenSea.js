// 
import OpenSea from '~/logic/collectibles/sources/OpenSea'
import mockedOpenSea from '~/logic/collectibles/sources/mocked_opensea'

class MockedOpenSea extends OpenSea {
  _fetch = async () => {
    await this._rateLimit()
    return { json: () => mockedOpenSea }
  }
}

export default MockedOpenSea
