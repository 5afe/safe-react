import { AbiItem } from 'web3-utils'
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import memoize from 'lodash.memoize'
import ProxyFactorySol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxyFactory.json'
import SafeProxy from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxy.json'
import Web3 from 'web3'

import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { isProxyCode } from 'src/logic/contracts/historicProxyCode'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { calculateGasOf, calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { getWeb3, getNetworkIdFrom } from 'src/logic/wallets/getWeb3'
import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { GnosisSafeProxyFactory } from 'src/types/contracts/GnosisSafeProxyFactory.d'

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'
export const MULTI_SEND_ADDRESS = '0x8d29be29923b68abfdd21e541b9374737b49cdad'
export const SAFE_MASTER_COPY_ADDRESS = '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F'
export const DEFAULT_FALLBACK_HANDLER_ADDRESS = '0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44'
export const SAFE_MASTER_COPY_ADDRESS_V10 = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A'


let proxyFactoryMaster: GnosisSafeProxyFactory
let safeMaster: GnosisSafe

/**
 * Creates a Contract instance of the GnosisSafe contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const createGnosisSafeContract = (web3: Web3, networkId: ETHEREUM_NETWORK) => {
  const networks = GnosisSafeSol.networks
  // TODO: this may not be the most scalable approach,
  //  but up until v1.2.0 the address is the same for all the networks.
  //  So, if we can't find the network in the Contract artifact, we fallback to MAINNET.
  const contractAddress = networks[networkId]?.address ?? networks[ETHEREUM_NETWORK.MAINNET].address
  return new web3.eth.Contract(GnosisSafeSol.abi as AbiItem[], contractAddress) as unknown as GnosisSafe
}

/**
 * Creates a Contract instance of the GnosisSafeProxyFactory contract
 * @param {Web3} web3
 * @param {ETHEREUM_NETWORK} networkId
 */
const createProxyFactoryContract = (web3: Web3, networkId: ETHEREUM_NETWORK): GnosisSafeProxyFactory => {
  const networks = ProxyFactorySol.networks
  // TODO: this may not be the most scalable approach,
  //  but up until v1.2.0 the address is the same for all the networks.
  //  So, if we can't find the network in the Contract artifact, we fallback to MAINNET.
  const contractAddress = networks[networkId]?.address ?? networks[ETHEREUM_NETWORK.MAINNET].address
  return new web3.eth.Contract(ProxyFactorySol.abi as AbiItem[], contractAddress) as unknown as GnosisSafeProxyFactory
}

export const getGnosisSafeContract = memoize(createGnosisSafeContract)

const getCreateProxyFactoryContract = memoize(createProxyFactoryContract)

const instantiateMasterCopies = async () => {
  const web3 = getWeb3()
  const networkId = await getNetworkIdFrom(web3)

  // Create ProxyFactory Master Copy
  proxyFactoryMaster = getCreateProxyFactoryContract(web3, networkId)

  // Create Safe Master copy
  safeMaster = getGnosisSafeContract(web3, networkId)
}

export const initContracts = instantiateMasterCopies

export const getSafeMasterContract = async () => {
  await initContracts()

  return safeMaster
}

export const getSafeDeploymentTransaction = (safeAccounts, numConfirmations) => {
  const gnosisSafeData = safeMaster.methods
    .setup(safeAccounts, numConfirmations, ZERO_ADDRESS, '0x', DEFAULT_FALLBACK_HANDLER_ADDRESS, ZERO_ADDRESS, 0, ZERO_ADDRESS)
    .encodeABI()

  return proxyFactoryMaster.methods.createProxy(safeMaster.options.address, gnosisSafeData)
}

export const estimateGasForDeployingSafe = async (
  safeAccounts,
  numConfirmations,
  userAccount,
) => {
  const gnosisSafeData = await safeMaster.methods
    .setup(safeAccounts, numConfirmations, ZERO_ADDRESS, '0x', DEFAULT_FALLBACK_HANDLER_ADDRESS, ZERO_ADDRESS, 0, ZERO_ADDRESS)
    .encodeABI()
  const proxyFactoryData = proxyFactoryMaster.methods
    .createProxy(safeMaster.options.address, gnosisSafeData)
    .encodeABI()
  const gas = await calculateGasOf(proxyFactoryData, userAccount, proxyFactoryMaster.options.address)
  const gasPrice = await calculateGasPrice()

  return gas * parseInt(gasPrice, 10)
}

export const getGnosisSafeInstanceAt = (safeAddress: string): GnosisSafe => {
  const web3 = getWeb3()
  return new web3.eth.Contract(GnosisSafeSol.abi as AbiItem[], safeAddress) as unknown as GnosisSafe
}

const cleanByteCodeMetadata = (bytecode: string): string => {
  const metaData = 'a165'
  return bytecode.substring(0, bytecode.lastIndexOf(metaData))
}

export const validateProxy = async (safeAddress: string): Promise<boolean> => {
  // https://solidity.readthedocs.io/en/latest/metadata.html#usage-for-source-code-verification
  const web3 = getWeb3()
  const code = await web3.eth.getCode(safeAddress)
  const codeWithoutMetadata = cleanByteCodeMetadata(code)
  const supportedProxies = [SafeProxy]
  for (let i = 0; i < supportedProxies.length; i += 1) {
    const proxy = supportedProxies[i]
    const proxyCode = proxy.deployedBytecode
    const proxyCodeWithoutMetadata = cleanByteCodeMetadata(proxyCode)
    if (codeWithoutMetadata === proxyCodeWithoutMetadata) {
      return true
    }
  }


  return isProxyCode(codeWithoutMetadata)
}
