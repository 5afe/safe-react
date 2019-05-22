// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'

const generateTypedDataFrom = async (
  safe: any,
  safeAddress: string,
  to: string,
  valueInWei: number,
  nonce: number,
  data: string,
  operation: number,
  txGasEstimate: number,
) => {
  const txGasToken = 0
  // const threshold = await safe.getThreshold()
  // estimateDataGas(safe, to, valueInWei, data, operation, txGasEstimate, txGasToken, nonce, threshold)
  const dataGasEstimate = 0
  const gasPrice = 0
  const refundReceiver = 0
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
        { type: 'uint256', name: 'dataGas' },
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
      safeTxGas: txGasEstimate,
      dataGas: dataGasEstimate,
      gasPrice,
      gasToken: txGasToken,
      refundReceiver,
      nonce: Number(nonce),
    },
  }

  return typedData
}

export const generateMetamaskSignature = async (
  safe: any,
  safeAddress: string,
  sender: string,
  to: string,
  valueInWei: number,
  nonce: number,
  data: string,
  operation: number,
  txGasEstimate: number,
) => {
  const web3 = getWeb3()
  const typedData = await generateTypedDataFrom(
    safe,
    safeAddress,
    to,
    valueInWei,
    nonce,
    data,
    operation,
    txGasEstimate,
  )
  console.log({sender})
  const jsonTypedData = JSON.stringify(typedData)
  const signedTypedData = {
    method: 'eth_signTypedData_v3',
    // To change once Metamask fixes their status
    // https://github.com/MetaMask/metamask-extension/pull/5368
    // https://github.com/MetaMask/metamask-extension/issues/5366
    params: [sender, jsonTypedData],
    from: sender,
  }
  const txSignedResponse = await web3.currentProvider.sendAsync(signedTypedData)

  return txSignedResponse.result.replace(EMPTY_DATA, '')
}
