// @flow
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const EIP712_NOT_SUPPORTED_ERROR_MSG = "EIP712 is not supported by user's wallet"

const generateTypedDataFrom = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  refundReceiver,
  safeAddress,
  safeTxGas,
  to,
  valueInWei,
}) => {
  const typedData = {
    types: {
      EIP712Domain: [
        {
          type: 'address',
          name: 'verifyingContract',
        },
      ],
      SafeTx: [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'value' },
        { type: 'bytes', name: 'data' },
        { type: 'uint8', name: 'operation' },
        { type: 'uint256', name: 'safeTxGas' },
        { type: 'uint256', name: 'baseGas' },
        { type: 'uint256', name: 'gasPrice' },
        { type: 'address', name: 'gasToken' },
        { type: 'address', name: 'refundReceiver' },
        { type: 'uint256', name: 'nonce' },
      ],
    },
    domain: {
      verifyingContract: safeAddress,
    },
    primaryType: 'SafeTx',
    message: {
      to,
      value: valueInWei,
      data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce: Number(nonce),
    },
  }

  return typedData
}

export const generateEIP712Signature = async txArgs => {
  console.log('trying to sign via eip712')
  const web3 = getWeb3()
  const typedData = await generateTypedDataFrom(txArgs)

  const jsonTypedData = JSON.stringify(typedData)
  const signedTypedData = {
    jsonrpc: '2.0',
    method: 'eth_signTypedData_v3',
    params: [txArgs.sender, jsonTypedData],
    from: txArgs.sender,
    id: new Date().getTime(),
  }

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(signedTypedData, (err, signature) => {
      if (err) {
        reject(err)
        return
      }

      if (signature.result == null) {
        reject(new Error(EIP712_NOT_SUPPORTED_ERROR_MSG))
        return
      }

      resolve(signature.result.replace(EMPTY_DATA, ''))
    })
  })
}
