import semverLessThan from 'semver/functions/lt'

import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { ModulePair } from 'src/logic/safe/store/models/safe'
import { SafeInfo } from 'src/logic/safe/utils/safeInformation'

type ModulesPaginated = {
  array: string[]
  next: string
}

const buildModulesLinkedList = (modules: string[], nextModule: string = SENTINEL_ADDRESS): Array<ModulePair> | null => {
  if (modules?.length) {
    return modules.map((moduleAddress, index, modules) => {
      const prevModule = modules[index + 1]
      return [moduleAddress, prevModule !== undefined ? prevModule : nextModule]
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

      // TODO: 100 is an arbitrary large number, to avoid the need for pagination. But pagination must be properly handled
      const modules: ModulesPaginated = await safeInstance.methods.getModulesPaginated(SENTINEL_ADDRESS, 100).call()

      return buildModulesLinkedList(modules.array, modules.next)
    } catch (e) {
      console.error('Failed to retrieve Safe modules', e)
    }
  }
}

export const getDisableModuleTxData = (modulePair: ModulePair, safeAddress: string): string => {
  const [module, previousModule] = modulePair
  const safeInstance = getGnosisSafeInstanceAt(safeAddress)

  return safeInstance.methods.disableModule(previousModule, module).encodeABI()
}
