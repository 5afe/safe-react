// @flow
export type InterfaceParams = {
  internalType: string,
  name: string,
  type: string,
}

export type ContractInterface = {|
  constant: boolean,
  inputs: InterfaceParams[],
  name: string,
  outputs: InterfaceParams[],
  payable: boolean,
  stateMutability: string,
  type: string,
|}

export type ExtendedContractInterface = {|
  ...ContractInterface,
  action: string,
  signature: string,
  signatureHash: string,
|}

export type ABI = ContractInterface[]

export type ExtendedABI = ExtendedContractInterface[]
