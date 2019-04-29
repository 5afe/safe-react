// @flow
import contract from 'truffle-contract'
import { ensureOnce } from '~/utils/singleton'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import GnosisSafeSol from '#/GnosisSafe.json'
import ProxyFactorySol from '#/ProxyFactory.json'
import { calculateGasOf, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'

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

export const getGnosisSafeContract = ensureOnce(createGnosisSafeContract)
const getCreateProxyFactoryContract = ensureOnce(createProxyFactoryContract)

const instanciateMasterCopies = async () => {
  const web3 = getWeb3()

  // Create ProxyFactory Master Copy
  const ProxyFactory = getCreateProxyFactoryContract(web3)
  proxyFactoryMaster = await ProxyFactory.deployed()

  // Initialize safe master copy
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
  safeMaster = await GnosisSafe.new({ from: userAccount, gas: '6000000' })
}

export const initContracts = ensureOnce(process.env.NODE_ENV === 'test' ? createMasterCopies : instanciateMasterCopies)

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

  return proxyFactoryMaster.createProxy(safeMaster.address, gnosisSafeData, { from: userAccount, gas, gasPrice })
}

export const getGnosisSafeInstanceAt = async (safeAddress: string) => {
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = await GnosisSafe.at(safeAddress)

  return gnosisSafe
}
