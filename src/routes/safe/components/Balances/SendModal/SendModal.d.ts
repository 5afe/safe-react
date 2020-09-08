export type ProposedTX = {
  recipientAddress: string
  contractAddress: string
  amount: string
  token: string
  data: string
  abi?: string
  data?: string
  selectedMethod?: AbiItemExtended
}
