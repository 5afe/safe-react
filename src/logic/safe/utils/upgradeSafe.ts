import semverSatisfies from 'semver/functions/satisfies'

import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import {
  getGnosisSafeInstanceAt,
  getSafeMasterContractAddress,
  getFallbackHandlerContractAddress,
} from 'src/logic/contracts/safeContracts'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'

const getFallbackHandlerTxData = (safeAddress: string): string => {
  const hasSetFallbackHandler = semverSatisfies(LATEST_SAFE_VERSION, '>=1.1.0')

  const fallbackHandlerAddress = getFallbackHandlerContractAddress()
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, LATEST_SAFE_VERSION)

  return hasSetFallbackHandler
    ? safeInstance.methods.setFallbackHandler(fallbackHandlerAddress).encodeABI()
    : EMPTY_DATA
}

export const getUpgradeSafeTransactionHash = (safeAddress: string, safeCurrentVersion: string): string => {
  const safeMasterContractAddress = getSafeMasterContractAddress()
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeCurrentVersion)
  const updateSafeTxData = safeInstance.methods.changeMasterCopy(safeMasterContractAddress).encodeABI()
  const fallbackHandlerTxData = getFallbackHandlerTxData(safeAddress)
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
