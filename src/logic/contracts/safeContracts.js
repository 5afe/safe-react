// @flow
import contract from 'truffle-contract'
import ProxyFactorySol from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory.json'
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import SafeProxy from '@gnosis.pm/safe-contracts/build/contracts/Proxy.json'
import { ensureOnce } from '~/utils/singleton'
import { simpleMemoize } from '~/components/forms/validator'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { calculateGasOf, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

let proxyFactoryMaster
let safeMaster

const createGnosisSafeContract = (web3: any) => {
  const gnosisSafe = contract(GnosisSafeSol)
  gnosisSafe.setProvider(web3.currentProvider)

  return gnosisSafe
}

const createProxyFactoryContract = (web3: any) => {
  const proxyFactory = contract(ProxyFactorySol)
  proxyFactory.setProvider(web3.currentProvider)

  return proxyFactory
}

export const getGnosisSafeContract = simpleMemoize(createGnosisSafeContract)
const getCreateProxyFactoryContract = simpleMemoize(createProxyFactoryContract)

const instantiateMasterCopies = async () => {
  const web3 = getWeb3()

  // Create ProxyFactory Master Copy
  const ProxyFactory = getCreateProxyFactoryContract(web3)
  proxyFactoryMaster = await ProxyFactory.deployed()

  // Initialize Safe master copy
  const GnosisSafe = getGnosisSafeContract(web3)
  safeMaster = await GnosisSafe.deployed()
}

// ONLY USED IN TEST ENVIRONMENT
const createMasterCopies = async () => {
  const web3 = getWeb3()
  const accounts = await web3.eth.getAccounts()
  const userAccount = accounts[0]

  const ProxyFactory = getCreateProxyFactoryContract(web3)
  proxyFactoryMaster = await ProxyFactory.new({ from: userAccount, gas: '5000000' })

  const GnosisSafe = getGnosisSafeContract(web3)
  safeMaster = await GnosisSafe.new({ from: userAccount, gas: '7000000' })
}

export const initContracts = process.env.NODE_ENV === 'test' ? ensureOnce(createMasterCopies) : instantiateMasterCopies

export const getSafeMasterContract = async () => {
  await initContracts()

  return safeMaster
}

export const deploySafeContract = async (safeAccounts: string[], numConfirmations: number, userAccount: string) => {
  const gnosisSafeData = await safeMaster.contract.methods
    .setup(safeAccounts, numConfirmations, ZERO_ADDRESS, '0x', ZERO_ADDRESS, 0, ZERO_ADDRESS)
    .encodeABI()
  const proxyFactoryData = proxyFactoryMaster.contract.methods
    .createProxy(safeMaster.address, gnosisSafeData)
    .encodeABI()
  const gas = await calculateGasOf(proxyFactoryData, userAccount, proxyFactoryMaster.address)
  const gasPrice = await calculateGasPrice()

  return proxyFactoryMaster.createProxy(safeMaster.address, gnosisSafeData, {
    from: userAccount, gas, gasPrice, value: 0,
  })
}

export const estimateGasForDeployingSafe = async (
  safeAccounts: string[],
  numConfirmations: number,
  userAccount: string,
) => {
  const gnosisSafeData = await safeMaster.contract.methods
    .setup(safeAccounts, numConfirmations, ZERO_ADDRESS, '0x', ZERO_ADDRESS, 0, ZERO_ADDRESS)
    .encodeABI()
  const proxyFactoryData = proxyFactoryMaster.contract.methods
    .createProxy(safeMaster.address, gnosisSafeData)
    .encodeABI()
  const gas = await calculateGasOf(proxyFactoryData, userAccount, proxyFactoryMaster.address)
  const gasPrice = await calculateGasPrice()

  return gas * parseInt(gasPrice, 10)
}

export const getGnosisSafeInstanceAt = async (safeAddress: string) => {
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = await GnosisSafe.at(safeAddress)

  return gnosisSafe
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
  // Old PayingProxyCode
  const oldProxyCode = '0x60806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634555d5c91461008b5780635c60da1b146100b6575b73ffffffffffffffffffffffffffffffffffffffff600054163660008037600080366000845af43d6000803e6000811415610086573d6000fd5b3d6000f35b34801561009757600080fd5b506100a061010d565b6040518082815260200191505060405180910390f35b3480156100c257600080fd5b506100cb610116565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006002905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050905600'
  return codeWithoutMetadata === oldProxyCode
}
