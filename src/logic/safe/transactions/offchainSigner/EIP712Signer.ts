import { AbstractProvider } from 'web3-core'
import semverSatisfies from 'semver/functions/satisfies'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'

const EIP712_NOT_SUPPORTED_ERROR_MSG = "EIP712 is not supported by user's wallet"

const EIP712_DOMAIN_OLD = [
  {
    type: 'address',
    name: 'verifyingContract',
  },
]

const EIP712_DOMAIN = [
  {
    type: 'uint256',
    name: 'chainId',
  },
  {
    type: 'address',
    name: 'verifyingContract',
  },
]

export const getEip712MessageTypes = (safeVersion: string) => {
  const eip712WithChainId = semverSatisfies(safeVersion, '>=1.3.0')

  return {
    EIP712Domain: eip712WithChainId ? EIP712_DOMAIN : EIP712_DOMAIN_OLD,
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
  }
}

interface SigningTxArgs extends TxArgs {
  safeAddress: string
  safeVersion: string
}

export const generateTypedDataFrom = ({
  safeAddress,
  safeVersion,
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  refundReceiver,
  safeTxGas,
  to,
  valueInWei,
}: SigningTxArgs) => {
  const typedData = {
    types: getEip712MessageTypes(safeVersion),
    domain: {
      chainId: '4',
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

export const getEIP712Signer = (version?: string) => (txArgs) => {
  const web3 = getWeb3()
  const typedData = generateTypedDataFrom(txArgs)

  let method = 'eth_signTypedData_v3'
  if (version === 'v4') {
    method = 'eth_signTypedData_v4'
  }
  if (!version) {
    method = 'eth_signTypedData'
  }

  const jsonTypedData = JSON.stringify(typedData)
  const signedTypedData = {
    jsonrpc: '2.0',
    method,
    params: version === 'v3' || version === 'v4' ? [txArgs.sender, jsonTypedData] : [jsonTypedData, txArgs.sender],
    from: txArgs.sender,
    id: new Date().getTime(),
  }

  return new Promise((resolve, reject) => {
    const provider = web3.currentProvider as AbstractProvider
    provider.sendAsync(signedTypedData, (err, signature) => {
      if (err) {
        reject(err)
        return
      }

      if (signature?.result == null) {
        reject(new Error(EIP712_NOT_SUPPORTED_ERROR_MSG))
        return
      }

      resolve(signature.result.replace(EMPTY_DATA, ''))
    })
  })
}
