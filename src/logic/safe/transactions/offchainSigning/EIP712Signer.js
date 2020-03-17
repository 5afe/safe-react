// @flow
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'

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
      value: Number(valueInWei),
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
  const web3 = getWeb3()
  const typedData = await generateTypedDataFrom(txArgs)

  const jsonTypedData = JSON.stringify(typedData)
  const signedTypedData = {
    method: 'eth_signTypedData_v3',
    // To change once Metamask fixes their status
    // https://github.com/MetaMask/metamask-extension/pull/5368
    // https://github.com/MetaMask/metamask-extension/issues/5366
    params: [txArgs.sender, jsonTypedData],
    from: txArgs.sender,
  }

  web3.currentProvider.sendAsync(signedTypedData, (err, res) => {
    console.log(err, res)
    return res.replace(EMPTY_DATA, '')
  })
}
