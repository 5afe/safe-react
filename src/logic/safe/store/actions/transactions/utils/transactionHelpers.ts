import { TypedDataUtils } from 'eth-sig-util'

import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { getEip712MessageTypes, generateTypedDataFrom } from 'src/logic/safe/transactions/offchainSigner/EIP712Signer'

export const generateSafeTxHash = async (safeAddress: string, safeVersion: string, txArgs: TxArgs): Promise<string> => {
  const typedData = await generateTypedDataFrom({ safeAddress, safeVersion, ...txArgs })

  const messageTypes = getEip712MessageTypes(safeVersion)

  return `0x${TypedDataUtils.sign<typeof messageTypes>(typedData).toString('hex')}`
}
