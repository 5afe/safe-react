import { sameString } from 'src/utils/strings'
import { bufferToHex, ecrecover, pubToAddress } from 'ethereumjs-util'

export const isTxHashSignedWithPrefix = (txHash: string, signature: string, ownerAddress: string): boolean => {
  let hasPrefix
  try {
    const rsvSig = {
      r: Buffer.from(signature.slice(2, 66), 'hex'),
      s: Buffer.from(signature.slice(66, 130), 'hex'),
      v: parseInt(signature.slice(130, 132), 16),
    }
    const recoveredData = ecrecover(Buffer.from(txHash.slice(2), 'hex'), rsvSig.v, rsvSig.r, rsvSig.s)
    const recoveredAddress = bufferToHex(pubToAddress(recoveredData))
    hasPrefix = !sameString(recoveredAddress, ownerAddress)
  } catch (e) {
    hasPrefix = true
  }
  return hasPrefix
}

type AdjustVOverload = {
  (signingMethod: 'eth_signTypedData', signature: string): string
  (signingMethod: 'eth_sign', signature: string, safeTxHash: string, sender: string): string
}

export const adjustV: AdjustVOverload = (
  signingMethod: 'eth_sign' | 'eth_signTypedData',
  signature: string,
  safeTxHash?: string,
  sender?: string,
): string => {
  const MIN_VALID_V_VALUE = 27
  let sigV = parseInt(signature.slice(-2), 16)

  if (signingMethod === 'eth_sign') {
    /* 
      Usually returned V (last 1 byte) is 27 or 28 (valid ethereum value)
      Metamask with ledger returns v = 01, this is not valid for ethereum
      In case V = 0 or 1 we add it to 27 or 28
      Adding 4 is required if signed message was prefixed with "\x19Ethereum Signed Message:\n32"
      Some wallets do that, some wallets don't, V > 30 is used by contracts to differentiate between prefixed and non-prefixed messages
      https://github.com/gnosis/safe-contracts/blob/main/contracts/GnosisSafe.sol#L292
    */
    if (sigV < MIN_VALID_V_VALUE) {
      sigV += MIN_VALID_V_VALUE
    }
    const adjusted = signature.slice(0, -2) + sigV.toString(16)
    const signatureHasPrefix = isTxHashSignedWithPrefix(safeTxHash as string, adjusted, sender as string)
    if (signatureHasPrefix) {
      sigV += 4
    }
  }

  if (signingMethod === 'eth_signTypedData') {
    // Metamask with ledger returns V=0/1 here too, we need to adjust it to be ethereum's valid value (27 or 28)
    if (sigV < MIN_VALID_V_VALUE) {
      sigV += MIN_VALID_V_VALUE
    }
  }

  return signature.slice(0, -2) + sigV.toString(16)
}
