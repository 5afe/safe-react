// @flow
import { RateLimit } from 'async-sema'

import { ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import { ETHERSCAN_API_KEY } from '~/utils/constants'

type InterfaceParams = {
  internalType: string,
  name: string,
  type: string,
}
type ContractInterface = {|
  constant: boolean,
  inputs: InterfaceParams[],
  name: string,
  outputs: InterfaceParams[],
  payable: boolean,
  stateMutability: string,
  type: string,
|}
type ExtendedContractInterface = {| ...ContractInterface, action: string |}
type ABI = ContractInterface[]
type ExtendedABI = ExtendedContractInterface[]

class EtherscanService {
  _rateLimit = async () => {}

  _endpointsUrls: { [key: string]: string } = {
    [ETHEREUM_NETWORK.MAINNET]: 'https://api.etherscan.io/api',
    [ETHEREUM_NETWORK.RINKEBY]: 'https://api-rinkeby.etherscan.io/api',
  }

  _fetch = async (url: string, contractAddress: string) => {
    let params = {
      module: 'contract',
      action: 'getAbi',
      address: contractAddress,
    }

    if (ETHERSCAN_API_KEY) {
      const apiKey = ETHERSCAN_API_KEY
      params = { ...params, apiKey }
    }

    return fetch(`${url}?${new URLSearchParams(params)}`)
  }

  constructor(options: { rps: number }) {
    this._rateLimit = RateLimit(options.rps)
  }

  static extractUsefulMethods(abi: ABI): ExtendedABI {
    return abi
      .filter(({ constant, name, type }) => type === 'function' && !!name && typeof constant === 'boolean')
      .map((method) => ({
        action: method.constant ? 'read' : 'write',
        ...method,
      }))
      .sort(({ name: a }, { name: b }) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
  }

  async getContractABI(contractAddress: string, network: string) {
    const etherscanUrl = this._endpointsUrls[network]
    try {
      const response = await this._fetch(etherscanUrl, contractAddress)

      if (!response.ok) {
        return undefined
      }

      const { result, status } = await response.json()

      if (status === '0') {
        return ''
      }

      return result
    } catch (e) {
      console.error('Failed to retrieve ABI', e)
      return undefined
    }
  }
}

export default EtherscanService
