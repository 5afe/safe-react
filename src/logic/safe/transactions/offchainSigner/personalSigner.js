// @flow
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'

const PERSONAL_SIGN_NOT_SUPPORTED_ERROR_MSG = 'PERSONAL_SIGN_NOT_SUPPORTED'

export const getPersonalSigner = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  refundReceiver,
  safeInstance,
  safeTxGas,
  sender,
  to,
  valueInWei,
}) => {
  const web3 = await getWeb3()
  const txHash = await safeInstance.getTransactionHash(
    to,
    valueInWei,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce,
    {
      from: sender,
    },
  )

  return new Promise(function (resolve, reject) {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'personal_sign',
        params: [txHash, sender],
        id: new Date().getTime(),
      },
      async function (err, signature) {
        if (err) {
          return reject(err)
        }

        if (signature.result == null) {
          reject(new Error(PERSONAL_SIGN_NOT_SUPPORTED_ERROR_MSG))
          return
        }

        resolve(signature.result.replace(EMPTY_DATA, ''))
      },
    )
  })
}
