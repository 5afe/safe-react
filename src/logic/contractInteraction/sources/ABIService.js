// @flow
import type Web3 from 'web3'

import type {
  ABI,
  ContractInterface,
  ExtendedABI,
  ExtendedContractInterface,
} from '~/logic/contractInteraction/sources/types'
import { getWeb3 } from '~/logic/wallets/getWeb3'

class ABIService {
  static extractUsefulMethods(abi: ABI): ExtendedABI {
    return abi
      .filter(({ constant, name, type }) => type === 'function' && !!name && typeof constant === 'boolean')
      .map((method) => ({
        action: method.constant ? 'read' : 'write',
        ...ABIService.getMethodSignatureAndSignatureHash(method),
        ...method,
      }))
      .sort(({ name: a }, { name: b }) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
  }

  static getMethodHash(method: ContractInterface): string {
    const signature = ABIService.getMethodSignature(method)
    return ABIService.getSignatureHash(signature)
  }

  static getMethodSignatureAndSignatureHash(
    method: ContractInterface,
  ): {|
    signature: string,
    signatureHash: string,
  |} {
    const signature = ABIService.getMethodSignature(method)
    const signatureHash = ABIService.getSignatureHash(signature)
    return { signature, signatureHash }
  }

  static getMethodSignature({ inputs, name }: ContractInterface): string {
    const params = inputs.map((x) => x.type).join(',')
    return `${name}(${params})`
  }

  static getSignatureHash(signature: string): string {
    const web3: Web3 = getWeb3()
    return web3.utils.keccak256(signature).toString(2, 10)
  }

  static isPayable(method: ContractInterface | ExtendedContractInterface): boolean {
    return method.payable
  }
}

export default ABIService
