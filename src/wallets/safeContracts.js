// @flow
import contract from 'truffle-contract'
import { promisify } from '~/utils/promisify'
import { ensureOnce } from '~/utils/singleton'
import { getWeb3 } from '~/wallets/getWeb3'
import GnosisSafeSol from '#/GnosisSafeTeamEdition.json'
import ProxyFactorySol from '#/ProxyFactory.json'
import CreateAndAddModule from '#/CreateAndAddModule.json'
import DailyLimitModule from '#/DailyLimitModule.json'

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
  const createAndAddModule = contract(CreateAndAddModule)
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

const createMasterCopies = async () => {
  const web3 = getWeb3()
  const accounts = await promisify(cb => web3.eth.getAccounts(cb))
  const userAccount = accounts[0]

  // Create ProxyFactory Master Copy
  const ProxyFactory = getCreateProxyFactoryContract(web3)
  try {
    proxyFactoryMaster = await ProxyFactory.deployed()
  } catch (err) {
    proxyFactoryMaster = await ProxyFactory.new({ from: userAccount, gas: '5000000' })
  }

  // Create AddExtension Master Copy
  const CreateAndAddExtension = getCreateAddExtensionContract(web3)
  try {
    createAndAddExtensionMaster = await CreateAndAddExtension.deployed()
  } catch (err) {
    createAndAddExtensionMaster = await CreateAndAddExtension.new({ from: userAccount, gas: '5000000' })
  }

  // Initialize safe master copy
  const GnosisSafe = getGnosisSafeContract(web3)
  try {
    safeMaster = await GnosisSafe.deployed()
  } catch (err) {
    safeMaster = await GnosisSafe.new([userAccount], 1, 0, 0, { from: userAccount, gas: '5000000' })
  }

  // Initialize extension master copy
  const DailyLimitExtension = getCreateDailyLimitExtensionContract(web3)
  try {
    dailyLimitMaster = await DailyLimitExtension.deployed()
  } catch (err) {
    dailyLimitMaster = await DailyLimitExtension.new([], [], { from: userAccount, gas: '5000000' })
  }
}

export const initContracts = ensureOnce(createMasterCopies)

const getSafeDataBasedOn = async (accounts, numConfirmations, dailyLimitInEth) => {
  const web3 = getWeb3()

  const moduleData = await dailyLimitMaster.contract.setup
    .getData([0], [web3.toWei(dailyLimitInEth, 'ether')])

  const proxyFactoryData = await proxyFactoryMaster.contract.createProxy
    .getData(dailyLimitMaster.address, moduleData)

  const createAndAddExtensionData = createAndAddExtensionMaster.contract.createAndAddModule
    .getData(proxyFactoryMaster.address, proxyFactoryData)

  return safeMaster.contract.setup
    .getData(accounts, numConfirmations, createAndAddExtensionMaster.address, createAndAddExtensionData)
}

export const deploySafeContract = async (
  safeAccounts: string[],
  numConfirmations: number,
  dailyLimit: number,
  userAccount: string,
) => {
  const gnosisSafeData = await getSafeDataBasedOn(safeAccounts, numConfirmations, dailyLimit)
  return proxyFactoryMaster.createProxy(safeMaster.address, gnosisSafeData, { from: userAccount, gas: '5000000' })
}
