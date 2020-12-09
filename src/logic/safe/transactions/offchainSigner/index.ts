import { getEIP712Signer } from './EIP712Signer'
import { ethSigner } from './ethSigner'
import { METAMASK_REJECT_CONFIRM_TX_ERROR_CODE } from 'src/logic/safe/store/actions/createTransaction'

// 1. we try to sign via EIP-712 if user's wallet supports it
// 2. If not, try to use eth_sign (Safe version has to be >1.1.1)
// If eth_sign, doesn't work continue with the regular flow (on-chain signatures, more in createTransaction.ts)

const SIGNERS = {
  EIP712_V3: getEIP712Signer('v3'),
  EIP712_V4: getEIP712Signer('v4'),
  EIP712: getEIP712Signer(),
  ETH_SIGN: ethSigner,
}

// hardware wallets support eth_sign only
const getSignersByWallet = (isHW) =>
  isHW ? [SIGNERS.ETH_SIGN] : [SIGNERS.EIP712_V3, SIGNERS.EIP712_V4, SIGNERS.EIP712, SIGNERS.ETH_SIGN]

export const SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES = '>=1.1.1'

export const tryOffchainSigning = async (safeTxHash: string, txArgs, isHW: boolean): Promise<string> => {
  let signature

  const signerByWallet = getSignersByWallet(isHW)
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
