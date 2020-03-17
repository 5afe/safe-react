// @flow

import { generateEIP712Signature } from './EIP712Signer'

export const trySigningViaEIP712 = async txArgs => {
  try {
    const signatureV3 = await generateEIP712Signature(txArgs)
  } catch (err) {
    console.log(err)
  }
}
