// @flow
import contract from 'truffle-contract'
import { promisify } from '~/utils/promisify'
import { ensureOnce } from '~/utils/singleton'
import { getWeb3 } from '~/wallets/getWeb3'
import GnosisSafeSol from '#/GnosisSafe.json'
import ProxyFactorySol from '#/ProxyFactory.json'
import CreateAndAddExtensionSol from '#/CreateAndAddExtension.json'
import DailyLimitExtensionSol from '#/DailyLimitExtension.json'

let proxyFactoryMaster
let createAndAddExtensionMaster
let safeMaster
let dailyLimitMaster

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

const createAddExtensionContract = (web3: any) => {
  const createAndAddExtension = contract(CreateAndAddExtensionSol)
  createAndAddExtension.setProvider(web3.currentProvider)

  return createAndAddExtension
}

const createDailyLimitExtensionContract = (web3: any) => {
  const dailyLimitExtension = contract(DailyLimitExtensionSol)
  dailyLimitExtension.setProvider(web3.currentProvider)

  return dailyLimitExtension
}

export const getGnosisSafeContract = ensureOnce(createGnosisSafeContract)
const getCreateProxyFactoryContract = ensureOnce(createProxyFactoryContract)
const getCreateAddExtensionContract = ensureOnce(createAddExtensionContract)
const getCreateDailyLimitExtensionContract = ensureOnce(createDailyLimitExtensionContract)

const createMasterCopies = async () => {
  const web3 = getWeb3()
  const accounts = await promisify(cb => web3.eth.getAccounts(cb))
  const userAccount = accounts[0]
  const ProxyFactory = getCreateProxyFactoryContract(web3)
  const CreateAndAddExtension = getCreateAddExtensionContract(web3)
  const DailyLimitExtension = getCreateDailyLimitExtensionContract(web3)

  // Create Master Copies
  proxyFactoryMaster = await ProxyFactory.new({ from: userAccount, gas: '5000000' })
  createAndAddExtensionMaster = await CreateAndAddExtension.new({ from: userAccount, gas: '5000000' })

  // Initialize safe master copy
  const GnosisSafe = getGnosisSafeContract(web3)
  safeMaster = await GnosisSafe.new({ from: userAccount, gas: '5000000' })
  safeMaster.setup([userAccount], 1, 0, 0, { from: userAccount, gas: '5000000' })

  // Initialize extension master copy
  dailyLimitMaster = await DailyLimitExtension.new({ from: userAccount, gas: '5000000' })
  dailyLimitMaster.setup([], [], { from: userAccount, gas: '5000000' })
}

export const initContracts = ensureOnce(createMasterCopies)

const getSafeDataBasedOn = async (accounts, numConfirmations) => {
  const extensionData = await dailyLimitMaster.contract.setup
    .getData([0], [100])
  const proxyFactoryData = await proxyFactoryMaster.contract.createProxy
    .getData(dailyLimitMaster.address, extensionData)
  const createAndAddExtensionData = createAndAddExtensionMaster.contract.createAndAddExtension
    .getData(proxyFactoryMaster.address, proxyFactoryData)

  return safeMaster.contract.setup
    .getData(accounts, numConfirmations, createAndAddExtensionMaster.address, createAndAddExtensionData)
}

export const deploySafeContract = async (safeAccounts: string[], numConfirmations: number, userAccount: string) => {
  const gnosisSafeData = await getSafeDataBasedOn(safeAccounts, numConfirmations)
  return proxyFactoryMaster.createProxy(safeMaster.address, gnosisSafeData, { from: userAccount, gas: '5000000' })
}
