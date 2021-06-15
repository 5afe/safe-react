import {
  getGnosisSafeInstanceAt,
  getSafeMasterContractAddress,
  getFallbackHandlerContractAddress,
} from 'src/logic/contracts/safeContracts'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'

export const getUpgradeSafeTransactionHash = (safeAddress: string, safeCurrentVersion: string): string => {
  const safeMasterContractAddress = getSafeMasterContractAddress()
  const fallbackHandlerAddress = getFallbackHandlerContractAddress()
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeCurrentVersion)
  const updateSafeTxData = safeInstance.methods.changeMasterCopy(safeMasterContractAddress).encodeABI()
  const fallbackHandlerTxData = safeInstance.methods.setFallbackHandler(fallbackHandlerAddress).encodeABI()
  const txs = [
    {
      to: safeAddress,
      value: '0',
      data: updateSafeTxData,
    },
    {
      to: safeAddress,
      value: '0',
      data: fallbackHandlerTxData,
    },
  ]

  return encodeMultiSendCall(txs)
}
