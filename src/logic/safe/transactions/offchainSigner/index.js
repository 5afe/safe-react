// @flow

import { generateEIP712Signature } from './EIP712Signer'
import { generateEthSignature } from './ethSigner'

// 1. we try to sign via EIP-712 if user's wallet supports it
// 2. If not, try to use eth_sign (Safe version has to be >1.1.1)
// If eth_sign, doesn't work continue with the regular flow (on-chain signatures, more in createTransaction.js)

const signingFuncs = [generateEIP712Signature, generateEthSignature]

export const tryOffchainSigning = async txArgs => {
  let signature
  for (let signingFunc of signingFuncs) {
    try {
      signature = await signingFunc(txArgs)

      break
    } catch (err) {
      if (err.code === 4001) {
        throw new Error('User denied sign request')
      }
    }
  }

  return signature
}
