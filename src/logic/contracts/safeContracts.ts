import semverSatisfies from 'semver/functions/satisfies'
import {
  getSafeSingletonDeployment,
  getSafeL2SingletonDeployment,
  getProxyFactoryDeployment,
  getFallbackHandlerDeployment,
  getMultiSendDeployment,
} from '@gnosis.pm/safe-deployments'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { calculateGasOf, EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3, getNetworkIdFrom } from 'src/logic/wallets/getWeb3'
import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { GnosisSafeProxyFactory } from 'src/types/contracts/GnosisSafeProxyFactory.d'
import { FallbackManager } from 'src/types/contracts/FallbackManager.d'
import { MultiSend } from 'src/types/contracts/MultiSend.d'
import { getSafeInfo, SafeInfo } from 'src/logic/safe/utils/safeInformation'

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

let proxyFactoryMaster: GnosisSafeProxyFactory
let safeMaster: GnosisSafe
let fallbackHandler: FallbackManager
let multiSend: MultiSend

const getSafeContractDeployment = (networkId?: ETHEREUM_NETWORK) => {
  // If version is 1.3.0 we can use instance compatible with L2 for all networks
  const useL2ContractVersion = semverSatisfies(LATEST_SAFE_VERSION, '>=1.3.0')
  const getDeployment = useL2ContractVersion ? getSafeL2SingletonDeployment : getSafeSingletonDeployment
  return getDeployment({
    version: LATEST_SAFE_VERSION,
    network: networkId?.toString(),
  }) || getDeployment({
    version: LATEST_SAFE_VERSION,
  })
}

/**
 * Creates a Contract instance of the GnosisSafe contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
export const getGnosisSafeContract = (web3: Web3, networkId: ETHEREUM_NETWORK) => {
  const safeSingletonDeployment = getSafeContractDeployment(networkId)

  const contractAddress =
    safeSingletonDeployment?.networkAddresses[networkId] ?? safeSingletonDeployment?.defaultAddress
  return (new web3.eth.Contract(safeSingletonDeployment?.abi as AbiItem[], contractAddress) as unknown) as GnosisSafe
}

/**
 * Creates a Contract instance of the GnosisSafeProxyFactory contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const getProxyFactoryContract = (web3: Web3, networkId: ETHEREUM_NETWORK): GnosisSafeProxyFactory => {
  const proxyFactoryDeployment = getProxyFactoryDeployment({
    version: LATEST_SAFE_VERSION,
    network: networkId.toString(),
  }) || getProxyFactoryDeployment({
    version: LATEST_SAFE_VERSION,
  })

  const contractAddress = proxyFactoryDeployment?.networkAddresses[networkId] ?? proxyFactoryDeployment?.defaultAddress
  return (new web3.eth.Contract(
    proxyFactoryDeployment?.abi as AbiItem[],
    contractAddress,
  ) as unknown) as GnosisSafeProxyFactory
}

/**
 * Creates a Contract instance of the FallbackHandler contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const getFallbackHandlerContract = (web3: Web3, networkId: ETHEREUM_NETWORK): FallbackManager => {
  const fallbackHandlerDeployment = getFallbackHandlerDeployment({
    version: LATEST_SAFE_VERSION,
    network: networkId.toString(),
  }) || getFallbackHandlerDeployment({
    version: LATEST_SAFE_VERSION,
  })

  const contractAddress =
    fallbackHandlerDeployment?.networkAddresses[networkId] ?? fallbackHandlerDeployment?.defaultAddress
  return (new web3.eth.Contract(
    fallbackHandlerDeployment?.abi as AbiItem[],
    contractAddress,
  ) as unknown) as FallbackManager
}

/**
 * Creates a Contract instance of the MultiSend contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const getMultiSendContract = (web3: Web3, networkId: ETHEREUM_NETWORK): MultiSend => {
  const multiSendDeployment = getMultiSendDeployment({
    network: networkId.toString(),
  }) || getMultiSendDeployment()

  const contractAddress = multiSendDeployment?.networkAddresses[networkId] ?? multiSendDeployment?.defaultAddress
  return (new web3.eth.Contract(multiSendDeployment?.abi as AbiItem[], contractAddress) as unknown) as MultiSend
}

export const getMasterCopyAddressFromProxyAddress = async (proxyAddress: string): Promise<string | undefined> => {
  let masterCopyAddress: string | undefined
  try {
    const res = await getSafeInfo(proxyAddress)
    masterCopyAddress = (res as SafeInfo)?.implementation.value
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
  const networkId = await getNetworkIdFrom(web3)

  // Create ProxyFactory Master Copy
  proxyFactoryMaster = getProxyFactoryContract(web3, networkId)

  // Create Safe Master copy
  safeMaster = getGnosisSafeContract(web3, networkId)

  // Create Fallback Handler
  fallbackHandler = getFallbackHandlerContract(web3, networkId)

  // Create MultiSend contract
  multiSend = getMultiSendContract(web3, networkId)
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
  const safeSingletonDeployment = getSafeContractDeployment()

  const web3 = getWeb3()
  return (new web3.eth.Contract(safeSingletonDeployment?.abi as AbiItem[], safeAddress) as unknown) as GnosisSafe
}
