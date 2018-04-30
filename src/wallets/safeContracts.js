// @flow
import contract from 'truffle-contract'
import { ensureOnce } from '~/utils/singleton'
import GnosisSafeSol from '#/GnosisSafe.json'
import ProxyFactorySol from '#/ProxyFactory.json'
import CreateAndAddExtensionSol from '#/CreateAndAddExtension.json'
import DailyLimitExtensionSol from '#/DailyLimitExtension.json'

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
export const getCreateProxyFactoryContract = ensureOnce(createProxyFactoryContract)
export const getCreateAddExtensionContract = ensureOnce(createAddExtensionContract)
export const getCreateDailyLimitExtensionContract = ensureOnce(createDailyLimitExtensionContract)
