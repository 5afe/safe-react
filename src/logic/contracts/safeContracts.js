// @flow
import contract from 'truffle-contract'
import { ensureOnce } from '~/utils/singleton'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import GnosisSafeSol from '#/GnosisSafeTeamEdition.json'
import GnosisPersonalSafeSol from '#/GnosisSafePersonalEdition.json'
import ProxyFactorySol from '#/ProxyFactory.json'
import CreateAndAddModules from '#/CreateAndAddModules.json'
import DailyLimitModule from '#/DailyLimitModule.json'
import { calculateGasOf, calculateGasPrice, EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { signaturesViaMetamask } from '~/config'

let proxyFactoryMaster
let createAndAddModuleMaster
let safeMaster
let dailyLimitMaster

const createModuleDataWrapper = () => {
  const web3 = getWeb3()
  // eslint-disable-next-line
  return web3.eth.contract([{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}])
}

const getModuleDataWrapper = ensureOnce(createModuleDataWrapper)

function createAndAddModulesData(dataArray) {
  const ModuleDataWrapper = getModuleDataWrapper()

  const mw = ModuleDataWrapper.at(1)
  // Remove method id (10) and position of data in payload (64)
  return dataArray.reduce((acc, data) => acc + mw.setup.getData(data).substr(74), EMPTY_DATA)
}

const createGnosisSafeContract = (web3: any) => {
  if (signaturesViaMetamask()) {
    const gnosisSafe = contract(GnosisPersonalSafeSol)
    gnosisSafe.setProvider(web3.currentProvider)

    return gnosisSafe
  }

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
  const createAndAddModule = contract(CreateAndAddModules)
  createAndAddModule.setProvider(web3.currentProvider)

  return createAndAddModule
}

const createDailyLimitExtensionContract = (web3: any) => {
  const dailyLimitModule = contract(DailyLimitModule)
  dailyLimitModule.setProvider(web3.currentProvider)

  return dailyLimitModule
}

export const getGnosisSafeContract = ensureOnce(createGnosisSafeContract)
const getCreateProxyFactoryContract = ensureOnce(createProxyFactoryContract)
const getCreateAddExtensionContract = ensureOnce(createAddExtensionContract)
export const getCreateDailyLimitExtensionContract = ensureOnce(createDailyLimitExtensionContract)

const instanciateMasterCopies = async () => {
  const web3 = getWeb3()

  // Create ProxyFactory Master Copy
  const ProxyFactory = getCreateProxyFactoryContract(web3)
  proxyFactoryMaster = await ProxyFactory.deployed()

  // Create AddExtension Master Copy
  const CreateAndAddExtension = getCreateAddExtensionContract(web3)
  createAndAddModuleMaster = await CreateAndAddExtension.deployed()

  // Initialize safe master copy
  const GnosisSafe = getGnosisSafeContract(web3)
  safeMaster = await GnosisSafe.deployed()

  // Initialize extension master copy
  const DailyLimitExtension = getCreateDailyLimitExtensionContract(web3)
  dailyLimitMaster = await DailyLimitExtension.deployed()
}

// ONLY USED IN TEST ENVIRONMENT
const createMasterCopies = async () => {
  const web3 = getWeb3()
  const accounts = await promisify(cb => web3.eth.getAccounts(cb))
  const userAccount = accounts[0]

  const ProxyFactory = getCreateProxyFactoryContract(web3)
  proxyFactoryMaster = await ProxyFactory.new({ from: userAccount, gas: '5000000' })

  const CreateAndAddExtension = getCreateAddExtensionContract(web3)
  createAndAddModuleMaster = await CreateAndAddExtension.new({ from: userAccount, gas: '5000000' })

  const GnosisSafe = getGnosisSafeContract(web3)
  safeMaster = await GnosisSafe.new([userAccount], 1, 0, 0, { from: userAccount, gas: '5000000' })

  const DailyLimitExtension = getCreateDailyLimitExtensionContract(web3)
  dailyLimitMaster = await DailyLimitExtension.new([], [], { from: userAccount, gas: '5000000' })
}

export const initContracts = ensureOnce(process.env.NODE_ENV === 'test' ? createMasterCopies : instanciateMasterCopies)

const getSafeDataBasedOn = async (accounts, numConfirmations, dailyLimitInEth) => {
  const web3 = getWeb3()

  const moduleData = await dailyLimitMaster.contract.setup
    .getData([0], [web3.toWei(dailyLimitInEth, 'ether')])

  const proxyFactoryData = await proxyFactoryMaster.contract.createProxy
    .getData(dailyLimitMaster.address, moduleData)

  const modulesCreationData = createAndAddModulesData([proxyFactoryData])

  const createAndAddModuleData = createAndAddModuleMaster.contract.createAndAddModules
    .getData(proxyFactoryMaster.address, modulesCreationData)

  return safeMaster.contract.setup
    .getData(accounts, numConfirmations, createAndAddModuleMaster.address, createAndAddModuleData)
}

export const deploySafeContract = async (
  safeAccounts: string[],
  numConfirmations: number,
  dailyLimit: number,
  userAccount: string,
) => {
  const gnosisSafeData = await getSafeDataBasedOn(safeAccounts, numConfirmations, dailyLimit)
  const proxyFactoryData = proxyFactoryMaster.contract.createProxy.getData(safeMaster.address, gnosisSafeData)
  const gas = await calculateGasOf(proxyFactoryData, userAccount, proxyFactoryMaster.address)
  const gasPrice = await calculateGasPrice()

  return proxyFactoryMaster.createProxy(safeMaster.address, gnosisSafeData, { from: userAccount, gas, gasPrice })
}

export const getGnosisSafeInstanceAt = async (safeAddress: string) => {
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = GnosisSafe.at(safeAddress)

  return gnosisSafe
}
