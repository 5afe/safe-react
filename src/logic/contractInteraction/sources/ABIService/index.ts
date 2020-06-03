import { AbiItem } from 'web3-utils'

import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'

export interface AbiItemExtended extends AbiItem {
  action: string
  methodSignature: string
  signatureHash: string
}

export const getMethodSignature = ({ inputs, name }: AbiItem) => {
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

export const extractUsefulMethods = (abi: AbiItem[]): AbiItemExtended[] => {
  return abi
    .filter(({ constant, name, type }) => type === 'function' && !!name && typeof constant === 'boolean')
    .map(
      (method): AbiItemExtended => ({
        action: method.constant ? 'read' : 'write',
        ...getMethodSignatureAndSignatureHash(method),
        ...method,
      }),
    )
    .sort(({ name: a }, { name: b }) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
}

export const isPayable = (method: AbiItem | AbiItemExtended): boolean => {
  return method.payable
}
