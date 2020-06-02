import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { ABI, ExtendedABI } from './types'

export const getMethodSignature = ({ inputs, name }) => {
  const params = inputs.map((x) => x.type).join(',')
  return `${name}(${params})`
}

export const getSignatureHash = (signature) => {
  const web3 = getWeb3()
  return web3.utils.keccak256(signature).toString()
}

export const getMethodHash = (method) => {
  const signature = getMethodSignature(method)
  return getSignatureHash(signature)
}

export const getMethodSignatureAndSignatureHash = (method) => {
  const methodSignature = getMethodSignature(method)
  const signatureHash = getSignatureHash(methodSignature)
  return { methodSignature, signatureHash }
}

export const extractUsefulMethods = (abi: ABI): ExtendedABI => {
  return abi
    .filter(({ constant, name, type }) => type === 'function' && !!name && typeof constant === 'boolean')
    .map((method) => ({
      action: method.constant ? 'read' : 'write',
      ...getMethodSignatureAndSignatureHash(method),
      ...method,
    }))
    .sort(({ name: a }, { name: b }) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
}

export const isPayable = (method) => {
  return method.payable
}
