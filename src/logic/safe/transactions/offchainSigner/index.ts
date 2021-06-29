import semverSatisfies from 'semver/functions/satisfies'

import { METAMASK_REJECT_CONFIRM_TX_ERROR_CODE } from 'src/logic/safe/store/actions/createTransaction'
import { getEIP712Signer } from './EIP712Signer'
import { ethSigner } from './ethSigner'

// 1. we try to sign via EIP-712 if user's wallet supports it
// 2. If not, try to use eth_sign (Safe version has to be >1.1.1)
// If eth_sign, doesn't work continue with the regular flow (on-chain signatures, more in createTransaction.ts)

const SIGNERS = {
  EIP712_V3: getEIP712Signer('v3'),
  EIP712_V4: getEIP712Signer('v4'),
  EIP712: getEIP712Signer(),
  ETH_SIGN: ethSigner,
}

export const SAFE_VERSION_FOR_OFF_CHAIN_SIGNATURES = '>=1.0.0'

// hardware wallets support eth_sign only
// eth_sign is only supported by safes >= 1.1.0
const getSupportedSigners = (isHW: boolean, safeVersion: string) => {
  const safeSupportsEthSigner = semverSatisfies(safeVersion, '>=1.1.0')

  const signers = isHW ? [] : [SIGNERS.EIP712_V3, SIGNERS.EIP712_V4, SIGNERS.EIP712]

  if (safeSupportsEthSigner) {
    signers.push(SIGNERS.ETH_SIGN)
  }

  return signers
}

export const tryOffChainSigning = async (
  safeTxHash: string,
  txArgs,
  isHW: boolean,
  safeVersion: string,
): Promise<string | undefined> => {
  let signature

  const signerByWallet = getSupportedSigners(isHW, safeVersion)
  for (const signingFunc of signerByWallet) {
    try {
      signature = await signingFunc({ ...txArgs, safeTxHash })

      break
    } catch (err) {
      console.error(err)
      if (err.code === METAMASK_REJECT_CONFIRM_TX_ERROR_CODE) {
        throw err
      }
    }
  }

  return signature
}
