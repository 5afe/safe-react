import semverLessThan from 'semver/functions/lt'

import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { CreateTransactionArgs } from 'src/logic/safe/store/actions/createTransaction'
import { ModulePair } from 'src/logic/safe/store/models/safe'
import { CALL, TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { SafeInfo } from 'src/logic/safe/utils/safeInformation'

type ModulesPaginated = {
  array: string[]
  next: string
}

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

/**
 * Returns a list of Modules if there's any, in the form of [module, prevModule][]
 * so we have an easy track of the prevModule and the currentModule when calling `disableModule`
 *
 * There's a slight difference on how many modules `getModules` return, depending on the Safe's version we're in:
 *  - for >= v1.1.1 it will return a list of up to 10 modules
 *  - for previous version it will return a list of all the modules enabled
 *
 * As we're using the safe-transactions service, and it's querying `getModules`,
 *   we'll fallback to `getModulesPaginated` RPC call when needed.
 *
 * @todo: Implement pagination for `getModulesPaginated`. We're passing an arbitrary large number to avoid pagination.
 *
 * @param {SafeInfo | undefined } safeInfo
 * @returns Array<ModulePair> | null | undefined
 */
export const getModules = async (safeInfo: SafeInfo | void): Promise<Array<ModulePair> | null | undefined> => {
  if (!safeInfo) {
    return
  }

  if (semverLessThan(safeInfo.version, '1.1.1')) {
    // we can use the `safeInfo.modules`, as versions previous to 1.1.1 return the whole list of modules
    return buildModulesLinkedList(safeInfo.modules)
  } else {
    // newer versions `getModules` call returns up to 10 modules
    if (safeInfo.modules.length < 10) {
      // we're sure that we got all the modules
      return buildModulesLinkedList(safeInfo.modules)
    }

    try {
      // lastly, if `safeInfo.modules` have 10 items,
      // we'll fallback to `getModulesPaginated` RPC call
      // as we're not sure if there are more than 10 modules enabled for the current Safe
      const safeInstance = getGnosisSafeInstanceAt(safeInfo.address)

      // TODO: 100 is an arbitrary large number, to avoid the need for pagination.
      //  But pagination must be properly handled
      //  if `modules.next !== SENTINEL_ADDRESS`, then we have more modules to retrieve
      const modules: ModulesPaginated = await safeInstance.methods.getModulesPaginated(SENTINEL_ADDRESS, 100).call()

      return buildModulesLinkedList(modules.array)
    } catch (e) {
      console.error('Failed to retrieve Safe modules', e)
    }
  }
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
