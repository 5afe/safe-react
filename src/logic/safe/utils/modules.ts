import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { CreateTransactionArgs } from 'src/logic/safe/store/actions/createTransaction'
import { ModulePair } from 'src/logic/safe/store/models/safe'
import { CALL, TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

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

export const getDisableModuleTxData = (modulePair: ModulePair, safeAddress: string): string => {
  const [previousModule, module] = modulePair
  const safeInstance = getGnosisSafeInstanceAt(safeAddress)

  return safeInstance.methods.disableModule(previousModule, module).encodeABI()
}

type EnableModuleParams = {
  moduleAddress: string
  safeAddress: string
}
export const enableModuleTx = ({ moduleAddress, safeAddress }: EnableModuleParams): CreateTransactionArgs => {
  const safeInstance = getGnosisSafeInstanceAt(safeAddress)

  return {
    safeAddress,
    to: safeAddress,
    operation: CALL,
    valueInWei: '0',
    txData: safeInstance.methods.enableModule(moduleAddress).encodeABI(),
    notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
  }
}
