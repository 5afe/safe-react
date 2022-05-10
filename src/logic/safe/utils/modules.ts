import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'

import { SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { CreateTransactionArgs } from 'src/logic/safe/store/actions/createTransaction'
import { ModulePair } from 'src/logic/safe/store/models/safe'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'

/**
 * Builds a collection of tuples with (prev, module) module addresses
 *
 * The `modules` param, is organized from the most recently added to the oldest.
 *
 * By assuming this, we are able to recreate the linked list that's defined at contract level
 *   considering `0x1` (SENTINEL_ADDRESS) address as the list's initial node.
 *
 * Given this scenario, we have a linked list in the form of
 *
 *  **`0x1->modules[n]->module[n-1]->module[0]->0x1`**
 *
 * So,
 *  - if we want to disable `module[n]`, we need to pass `(module[n], 0x1)` as arguments,
 *  - if we want to disable `module[n-1]`, we need to pass `(module[n-1], module[n])`,
 *  - ... and so on
 * @param {Array<string>} modules
 * @returns null | Array<ModulePair>
 */
export const buildModulesLinkedList = (modules: string[]): Array<ModulePair> | null => {
  if (modules?.length) {
    return modules.map((moduleAddress, index, modules) => {
      if (index === 0) {
        return [SENTINEL_ADDRESS, moduleAddress]
      }
      return [modules[index - 1], moduleAddress]
    })
  }

  // no modules
  return null
}

type DisableModuleParams = {
  moduleAddress: string
  safeAddress: string
  safeVersion: string
  connectedWalletAddress: string
}

export const getDisableModuleTxData = async ({
  moduleAddress,
  safeAddress,
  safeVersion,
  connectedWalletAddress,
}: DisableModuleParams): Promise<string> => {
  const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
  const safeTx = await sdk.getDisableModuleTx(moduleAddress, { safeTxGas: 0 })

  return safeTx.data.data
}

type EnableModuleParams = {
  moduleAddress: string
  safeAddress: string
  safeVersion: string
  connectedWalletAddress: string
}

export const enableModuleTx = async ({
  moduleAddress,
  safeAddress,
  safeVersion,
  connectedWalletAddress,
}: EnableModuleParams): Promise<CreateTransactionArgs> => {
  const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
  const safeTx = await sdk.getEnableModuleTx(moduleAddress, { safeTxGas: 0 })

  return {
    safeAddress,
    to: safeAddress,
    operation: Operation.CALL,
    valueInWei: '0',
    txData: safeTx.data.data,
    notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
  }
}

export const isModuleEnabled = (modules: string[], moduleAddress: string): boolean => {
  return modules?.some((module) => sameAddress(module, moduleAddress)) ?? false
}
