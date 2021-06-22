type SigningMethod = 'eth_sign' | 'eth_signTypedData'

export const adjustV = (signingMethod: SigningMethod, signature: string): string => {
  let sigV = parseInt(signature.slice(-2), 16)
  console.log({ sigV })
  if (signingMethod === 'eth_sign') {
    // Usually returned V is 27 or 28 (valid ethereum value)
    // Metamask with ledger returns v = 01, this is not valid for ethereum
    // In case V = 0 or 1 we add it to 27 and then add 4
    // Adding 4 is required to make signature valid for safe contracts:
    // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#eth-sign-signature
    switch (sigV) {
      case 0:
      case 1:
        sigV += 31
        break
      case 27:
      case 28:
        sigV += 4
        break
      default:
        throw new Error('Invalid signature')
    }
  }

  if (signingMethod === 'eth_signTypedData') {
    // Metamask with ledger returns 0/1 here too, we need to adjust it to ethereum's valid value (27 or 28)
    switch (sigV) {
      case 0:
      case 1:
        sigV += 27
        break
      case 27:
      case 28:
        break
      default:
        throw new Error('Invalid signature')
    }
  }
  console.log({ sigV })
  return signature.slice(0, -2) + sigV.toString(16)
}
