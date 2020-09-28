import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { AbstractProvider } from 'web3-core/types'

const ETH_SIGN_NOT_SUPPORTED_ERROR_MSG = 'ETH_SIGN_NOT_SUPPORTED'

type EthSignerArgs = {
  safeTxHash: string
  sender: string
}

export const ethSigner = async ({ safeTxHash, sender }: EthSignerArgs): Promise<string> => {
  const web3 = await getWeb3()

  return new Promise(function (resolve, reject) {
    const provider = web3.currentProvider as AbstractProvider
    provider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'eth_sign',
        params: [sender, safeTxHash],
        id: new Date().getTime(),
      },
      async function (err, signature) {
        if (err) {
          return reject(err)
        }

        if (signature?.result == null) {
          reject(new Error(ETH_SIGN_NOT_SUPPORTED_ERROR_MSG))
          return
        }

        const sig = signature.result.replace(EMPTY_DATA, '')
        let sigV = parseInt(sig.slice(-2), 16)

        // Metamask with ledger returns v = 01, this is not valid for ethereum
        // For ethereum valid V is 27 or 28
        // In case V = 0 or 01 we add it to 27 and then add 4
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

        resolve(sig.slice(0, -2) + sigV.toString(16))
      },
    )
  })
}
