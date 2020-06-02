export interface InterfaceParams {
  internalType: string
  name: string
  type: string
}

export interface ContractInterface {
  constant: boolean
  inputs: InterfaceParams[]
  name: string
  outputs: InterfaceParams[]
  payable: boolean
  stateMutability: string
  type: string
}

export interface ExtendedContractInterface extends ContractInterface {
  action: string
  methodSignature: string
  signatureHash: string
}

export type ABI = ContractInterface[]

export type ExtendedABI = ExtendedContractInterface[]
