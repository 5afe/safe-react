import { AbiItem } from 'web3-utils'
import { getAllowanceModuleDeployment } from '@gnosis.pm/safe-modules-deployments'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { AllowanceModule } from 'src/types/contracts/allowance-module.d'
import { ChainId } from 'src/config/chain.d'

/**
 * Returns an address of the deployed AllowanceModule contract. Returns undefined if no address found.
 * @param {ChainId} chainId - The chainId of the network
 * @returns {string|undefined}
 */
const getSpendingLimitModuleAddress = (chainId: ChainId): string | undefined => {
  const deployment = getAllowanceModuleDeployment({ network: chainId })

  return deployment?.networkAddresses[chainId]
}

/**
 * Returns abi for the SpendingLimitModule contract
 * @returns {AbiItem[]}
 */
const getSpendingLimitModuleAbi = (): AbiItem[] => {
  // default deployment will always return the abi, so we can omit the undefined check and convert type
  const deployment = getAllowanceModuleDeployment()

  return deployment?.abi as AbiItem[]
}

/**
 * Creates a Contract instance of the SpendingLimitModule contract
 * @param {string} contractAddress - The address of the AllowanceModule contract
 */
const getSpendingLimitContract = (contractAddress: string): AllowanceModule => {
  const web3 = getWeb3()
  const abi = getSpendingLimitModuleAbi()

  return new web3.eth.Contract(abi, contractAddress) as unknown as AllowanceModule
}

export { getSpendingLimitModuleAddress, getSpendingLimitModuleAbi, getSpendingLimitContract }
