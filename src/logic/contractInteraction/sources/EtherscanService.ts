import { RateLimit } from 'async-sema'
import memoize from 'lodash.memoize'

import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import { ETHERSCAN_API_KEY } from 'src/utils/constants'

class EtherscanService {
  _rateLimit = async () => {}

  _endpointsUrls = {
    [ETHEREUM_NETWORK.MAINNET]: 'https://api.etherscan.io/api',
    [ETHEREUM_NETWORK.RINKEBY]: 'https://api-rinkeby.etherscan.io/api',
  }

  _fetch = memoize(
    async (url, contractAddress) => {
      let params: any = {
        module: 'contract',
        action: 'getAbi',
        address: contractAddress,
      }

      if (ETHERSCAN_API_KEY) {
        const apiKey = ETHERSCAN_API_KEY
        params = { ...params, apiKey }
      }

      const response = await fetch(`${url}?${new URLSearchParams(params)}`)

      if (!response.ok) {
        return { status: 0, result: [] }
      }

      return response.json()
    },
    (url, contractAddress) => `${url}_${contractAddress}`,
  )

  constructor(options) {
    this._rateLimit = RateLimit(options.rps)
  }

  async getContractABI(contractAddress, network) {
    const etherscanUrl = this._endpointsUrls[network]
    try {
      const { result, status } = await this._fetch(etherscanUrl, contractAddress)

      if (status === '0') {
        return []
      }

      return result
    } catch (e) {
      console.error('Failed to retrieve ABI', e)
      return undefined
    }
  }
}

export default EtherscanService
