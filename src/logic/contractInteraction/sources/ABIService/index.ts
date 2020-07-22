import { AbiItem } from 'web3-utils'

import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'

export interface AbiItemExtended extends AbiItem {
  action: string
  methodSignature: string
  signatureHash: string
}

export const getMethodSignature = ({ inputs, name }: AbiItem): string => {
  const params = inputs.map((x) => x.type).join(',')
  return `${name}(${params})`
}

export const getSignatureHash = (signature: string): string => {
  return web3.utils.keccak256(signature).toString()
}

export const getMethodHash = (method: AbiItem): string => {
  const signature = getMethodSignature(method)
  return getSignatureHash(signature)
}

export const getMethodSignatureAndSignatureHash = (
  method: AbiItem,
): { methodSignature: string; signatureHash: string } => {
  const methodSignature = getMethodSignature(method)
  const signatureHash = getSignatureHash(methodSignature)
  return { methodSignature, signatureHash }
}

export const isAllowedMethod = ({ name, type }: AbiItem): boolean => {
  return type === 'function' && !!name
}

export const getMethodAction = ({ stateMutability }: AbiItem): 'read' | 'write' => {
  return ['view', 'pure'].includes(stateMutability) ? 'read' : 'write'
}

export const extractUsefulMethods = (abi: AbiItem[]): AbiItemExtended[] => {
  return abi
    .filter(isAllowedMethod)
    .map(
      (method): AbiItemExtended => ({
        action: getMethodAction(method),
        ...getMethodSignatureAndSignatureHash(method),
        ...method,
      }),
    )
    .sort(({ name: a }, { name: b }) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
}

export const isPayable = (method: AbiItem | AbiItemExtended): boolean => {
  return method.payable
}
