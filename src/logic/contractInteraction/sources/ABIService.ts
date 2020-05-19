//

import { getWeb3 } from 'src/logic/wallets/getWeb3'

class ABIService {
  static extractUsefulMethods(abi) {
    return abi
      .filter(({ constant, name, type }) => type === 'function' && !!name && typeof constant === 'boolean')
      .map((method) => ({
        action: method.constant ? 'read' : 'write',
        ...ABIService.getMethodSignatureAndSignatureHash(method),
        ...method,
      }))
      .sort(({ name: a }, { name: b }) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
  }

  static getMethodHash(method) {
    const signature = ABIService.getMethodSignature(method)
    return ABIService.getSignatureHash(signature)
  }

  static getMethodSignatureAndSignatureHash(method) {
    const signature = ABIService.getMethodSignature(method)
    const signatureHash = ABIService.getSignatureHash(signature)
    return { signature, signatureHash }
  }

  static getMethodSignature({ inputs, name }) {
    const params = inputs.map((x) => x.type).join(',')
    return `${name}(${params})`
  }

  static getSignatureHash(signature) {
    const web3 = getWeb3()
    return web3.utils.keccak256(signature).toString()
  }

  static isPayable(method) {
    return method.payable
  }
}

export default ABIService
