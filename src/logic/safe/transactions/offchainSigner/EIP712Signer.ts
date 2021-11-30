import { AbstractProvider } from 'web3-core'
import semverSatisfies from 'semver/functions/satisfies'

import { getWeb3, getChainIdFrom } from 'src/logic/wallets/getWeb3'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { adjustV } from './utils'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'

const EIP712_NOT_SUPPORTED_ERROR_MSG = "EIP712 is not supported by user's wallet"

const EIP712_DOMAIN_BEFORE_V130 = [
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

type Eip712MessageTypes = {
  EIP712Domain: {
    type: string
    name: string
  }[]
  SafeTx: {
    type: string
    name: string
  }[]
}

// This function returns the types structure for signing offchain messages
// following EIP712
export const getEip712MessageTypes = (
  safeVersion: string,
): {
  EIP712Domain: typeof EIP712_DOMAIN | typeof EIP712_DOMAIN_BEFORE_V130
  SafeTx: Array<{ type: string; name: string }>
} => {
  const eip712WithChainId = semverSatisfies(safeVersion, '>=1.3.0')

  return {
    EIP712Domain: eip712WithChainId ? EIP712_DOMAIN : EIP712_DOMAIN_BEFORE_V130,
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

export interface SigningTxArgs extends TxArgs {
  safeAddress: string
  safeVersion: string
}

type GenerateTypedData = {
  types: Eip712MessageTypes
  domain: {
    chainId: number | undefined
    verifyingContract: string
  }
  primaryType: string
  message: {
    to: string
    value: string
    data: string
    operation: Operation
    safeTxGas: string
    baseGas: string
    gasPrice: string
    gasToken: string
    refundReceiver: string
    nonce: number
  }
}

export const generateTypedDataFrom = async ({
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
}: SigningTxArgs): Promise<GenerateTypedData> => {
  const web3 = getWeb3()
  const networkId = await getChainIdFrom(web3)
  const eip712WithChainId = semverSatisfies(safeVersion, '>=1.3.0')

  const typedData = {
    types: getEip712MessageTypes(safeVersion),
    domain: {
      chainId: eip712WithChainId ? networkId : undefined,
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

export const getEIP712Signer =
  (version?: string) =>
  async (txArgs: SigningTxArgs): Promise<string> => {
    const web3 = getWeb3()
    const typedData = await generateTypedDataFrom(txArgs)

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

        const sig = adjustV('eth_signTypedData', signature.result)

        resolve(sig.replace(EMPTY_DATA, ''))
      })
    })
  }
