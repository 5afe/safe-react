export interface InterfaceParams {
  internalType: string
  name: string
  type: string
}

export interface MethodInterface {
  constant: boolean
  inputs: InterfaceParams[]
  name: string
  outputs: InterfaceParams[]
  payable: boolean
  stateMutability: string
  type: string
}

export interface ExtendedContractInterface extends MethodInterface {
  action: string
  methodSignature: string
  signatureHash: string
}

export type ABI = MethodInterface[]

export type ExtendedABI = ExtendedContractInterface[]
