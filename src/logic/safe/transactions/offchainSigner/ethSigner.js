// @flow
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const generateEthSignature = async ({
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

  return new Promise(function(resolve, reject) {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'eth_sign',
        params: [sender, txHash],
        id: new Date().getTime(),
      },
      function(err, signature) {
        if (err) {
          return reject(err)
        }

        resolve(signature.result.replace(EMPTY_DATA, ''))
      },
    )
  })
}
