import semverSatisfies from 'semver/functions/satisfies'
import {
  getSafeSingletonDeployment,
  getSafeL2SingletonDeployment,
  getProxyFactoryDeployment,
  getFallbackHandlerDeployment,
  getMultiSendCallOnlyDeployment,
  getSignMessageLibDeployment,
} from '@gnosis.pm/safe-deployments'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import { getNetworkConfigById, getNetworkId } from 'src/config'
import { ETHEREUM_LAYER, ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { calculateGasOf, EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3, getNetworkIdFrom } from 'src/logic/wallets/getWeb3'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { ProxyFactory } from 'src/types/contracts/proxy_factory.d'
import { CompatibilityFallbackHandler } from 'src/types/contracts/compatibility_fallback_handler.d'
import { SignMessageLib } from 'src/types/contracts/sign_message_lib.d'
import { MultiSend } from 'src/types/contracts/multi_send.d'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

let proxyFactoryMaster: ProxyFactory
let safeMaster: GnosisSafe
let fallbackHandler: CompatibilityFallbackHandler
let multiSend: MultiSend

const getSafeContractDeployment = ({ safeVersion }: { safeVersion: string }) => {
  // We check if version is prior to v1.0.0 as they are not supported but still we want to keep a minimum compatibility
  const useOldestContractVersion = semverSatisfies(safeVersion, '<1.0.0')
  // We have to check if network is L2
  const networkId = getNetworkId()
  const networkConfig = getNetworkConfigById(networkId)
  // We had L1 contracts in three L2 networks, xDai, EWC and Volta so even if network is L2 we have to check that safe version is after v1.3.0
  const useL2ContractVersion =
    networkConfig?.network.ethereumLayer === ETHEREUM_LAYER.L2 && semverSatisfies(safeVersion, '>=1.3.0')
  const getDeployment = useL2ContractVersion ? getSafeL2SingletonDeployment : getSafeSingletonDeployment
  return (
    getDeployment({
      version: safeVersion,
      network: networkId.toString(),
    }) ||
    getDeployment({
      version: safeVersion,
    }) ||
    // In case we couldn't find a valid deployment and it's a version before 1.0.0 we return v1.0.0 to allow a minimum compatibility
    (useOldestContractVersion
      ? getDeployment({
          version: '1.0.0',
        })
      : undefined)
  )
}

/**
 * Creates a Contract instance of the GnosisSafe contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const getGnosisSafeContractInstance = (web3: Web3, networkId: ETHEREUM_NETWORK): GnosisSafe => {
  const safeSingletonDeployment = getSafeContractDeployment({ safeVersion: LATEST_SAFE_VERSION })

  const contractAddress =
    safeSingletonDeployment?.networkAddresses[networkId] ?? safeSingletonDeployment?.defaultAddress
  return new web3.eth.Contract(safeSingletonDeployment?.abi as AbiItem[], contractAddress) as unknown as GnosisSafe
}

/**
 * Creates a Contract instance of the GnosisSafeProxyFactory contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const getProxyFactoryContractInstance = (web3: Web3, networkId: ETHEREUM_NETWORK): ProxyFactory => {
  const proxyFactoryDeployment =
    getProxyFactoryDeployment({
      version: LATEST_SAFE_VERSION,
      network: networkId.toString(),
    }) ||
    getProxyFactoryDeployment({
      version: LATEST_SAFE_VERSION,
    })

  const contractAddress = proxyFactoryDeployment?.networkAddresses[networkId] ?? proxyFactoryDeployment?.defaultAddress
  return new web3.eth.Contract(proxyFactoryDeployment?.abi as AbiItem[], contractAddress) as unknown as ProxyFactory
}

/**
 * Creates a Contract instance of the FallbackHandler contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const getFallbackHandlerContractInstance = (web3: Web3, networkId: ETHEREUM_NETWORK): CompatibilityFallbackHandler => {
  const fallbackHandlerDeployment =
    getFallbackHandlerDeployment({
      version: LATEST_SAFE_VERSION,
      network: networkId.toString(),
    }) ||
    getFallbackHandlerDeployment({
      version: LATEST_SAFE_VERSION,
    })

  const contractAddress =
    fallbackHandlerDeployment?.networkAddresses[networkId] ?? fallbackHandlerDeployment?.defaultAddress
  return new web3.eth.Contract(
    fallbackHandlerDeployment?.abi as AbiItem[],
    contractAddress,
  ) as unknown as CompatibilityFallbackHandler
}

/**
 * Creates a Contract instance of the MultiSend contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const getMultiSendContractInstance = (web3: Web3, networkId: ETHEREUM_NETWORK): MultiSend => {
  const multiSendDeployment =
    getMultiSendCallOnlyDeployment({
      network: networkId.toString(),
    }) || getMultiSendCallOnlyDeployment()

  const contractAddress = multiSendDeployment?.networkAddresses[networkId] ?? multiSendDeployment?.defaultAddress
  return new web3.eth.Contract(multiSendDeployment?.abi as AbiItem[], contractAddress) as unknown as MultiSend
}

/**
 * Returns an address of SignMessageLib for passed chainId
 * @param {ETHEREUM_NETWORK} chainId
 * @returns {string}
 */
export const getSignMessageLibAddress = (chainId: ETHEREUM_NETWORK): string | undefined => {
  const signMessageLibDeployment =
    getSignMessageLibDeployment({
      network: chainId.toString(),
    }) || getSignMessageLibDeployment()

  const contractAddress =
    signMessageLibDeployment?.networkAddresses[chainId] ?? signMessageLibDeployment?.defaultAddress

  return contractAddress
}

/**
 * Returns a Web3 Contract instance of the SignMessageLib contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} chainId
 * @returns {SignMessageLib}
 */
export const getSignMessageLibContractInstance = (web3: Web3, chainId: ETHEREUM_NETWORK): SignMessageLib => {
  const signMessageLibDeployment =
    getSignMessageLibDeployment({
      network: chainId.toString(),
    }) || getSignMessageLibDeployment()

  const contractAddress =
    signMessageLibDeployment?.networkAddresses[chainId] ?? signMessageLibDeployment?.defaultAddress
  return new web3.eth.Contract(signMessageLibDeployment?.abi as AbiItem[], contractAddress) as unknown as SignMessageLib
}

export const getMasterCopyAddressFromProxyAddress = async (proxyAddress: string): Promise<string | undefined> => {
  let masterCopyAddress: string | undefined
  try {
    const res = await getSafeInfo(proxyAddress)
    masterCopyAddress = res.implementation.value
    if (!masterCopyAddress) {
      console.error(`There was not possible to get masterCopy address from proxy ${proxyAddress}.`)
    }
  } catch (e) {
    e.log()
  }
  return masterCopyAddress
}

export const instantiateSafeContracts = async () => {
  const web3 = getWeb3()
  const networkId = (await getNetworkIdFrom(web3)).toString() as ETHEREUM_NETWORK

  // Create ProxyFactory Master Copy
  proxyFactoryMaster = getProxyFactoryContractInstance(web3, networkId)

  // Create Safe Master copy
  safeMaster = getGnosisSafeContractInstance(web3, networkId)

  // Create Fallback Handler
  fallbackHandler = getFallbackHandlerContractInstance(web3, networkId)

  // Create MultiSend contract
  multiSend = getMultiSendContractInstance(web3, networkId)
}

export const getSafeMasterContract = async () => {
  await instantiateSafeContracts()
  return safeMaster
}

export const getSafeMasterContractAddress = () => {
  return safeMaster.options.address
}

export const getFallbackHandlerContractAddress = () => {
  return fallbackHandler.options.address
}

export const getMultisendContract = () => {
  return multiSend
}

export const getMultisendContractAddress = () => {
  return multiSend.options.address
}

export const getSafeDeploymentTransaction = (
  safeAccounts: string[],
  numConfirmations: number,
  safeCreationSalt: number,
) => {
  const gnosisSafeData = safeMaster.methods
    .setup(
      safeAccounts,
      numConfirmations,
      ZERO_ADDRESS,
      EMPTY_DATA,
      fallbackHandler.options.address,
      ZERO_ADDRESS,
      0,
      ZERO_ADDRESS,
    )
    .encodeABI()
  return proxyFactoryMaster.methods.createProxyWithNonce(safeMaster.options.address, gnosisSafeData, safeCreationSalt)
}

export const estimateGasForDeployingSafe = async (
  safeAccounts: string[],
  numConfirmations: number,
  userAccount: string,
  safeCreationSalt: number,
) => {
  const proxyFactoryData = getSafeDeploymentTransaction(safeAccounts, numConfirmations, safeCreationSalt).encodeABI()

  return calculateGasOf({
    data: proxyFactoryData,
    from: userAccount,
    to: proxyFactoryMaster.options.address,
  }).then((value) => value * 2)
}

export const getGnosisSafeInstanceAt = (safeAddress: string, safeVersion: string): GnosisSafe => {
  const safeSingletonDeployment = getSafeContractDeployment({ safeVersion })

  const web3 = getWeb3()
  return new web3.eth.Contract(safeSingletonDeployment?.abi as AbiItem[], safeAddress) as unknown as GnosisSafe
}
