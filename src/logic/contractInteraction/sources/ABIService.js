// @flow
import type {
  ABI,
  ContractInterface,
  ExtendedABI,
  ExtendedContractInterface,
} from '~/logic/contractInteraction/sources/types'

class ABIService {
  static extractUsefulMethods(abi: ABI): ExtendedABI {
    return abi
      .filter(({ constant, name, type }) => type === 'function' && !!name && typeof constant === 'boolean')
      .map((method) => ({
        action: method.constant ? 'read' : 'write',
        ...method,
      }))
      .sort(({ name: a }, { name: b }) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
  }

  static isPayable(method: ContractInterface | ExtendedContractInterface): boolean {
    return method.payable
  }
}

export default ABIService
