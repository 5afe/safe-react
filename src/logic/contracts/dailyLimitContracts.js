// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getGnosisSafeContract, getCreateDailyLimitExtensionContract } from '~/logic/contracts/safeContracts'
import { type DailyLimitProps } from '~/routes/safe/store/model/dailyLimit'

export const LIMIT_POSITION = 0
export const SPENT_TODAY_POS = 1


export const getDailyLimitModuleFrom = async (safeAddress: string) => {
  const web3 = getWeb3()
  const gnosisSafe = getGnosisSafeContract(web3).at(safeAddress)

  const modules = await gnosisSafe.getModules()
  const dailyAddress = modules[0]

  const dailyLimitModule = getCreateDailyLimitExtensionContract(web3).at(dailyAddress)
  if (await dailyLimitModule.manager.call() !== gnosisSafe.address) {
    throw new Error('Using an extension of different safe')
  }

  return dailyLimitModule
}

export const getDailyLimitFrom = async (safeAddress: string, tokenAddress: number): Promise<DailyLimitProps> => {
  const web3 = getWeb3()
  const dailyLimitModule = await getDailyLimitModuleFrom(safeAddress)

  const dailyLimitEth = await dailyLimitModule.dailyLimits(tokenAddress)

  const limit = web3.fromWei(dailyLimitEth[LIMIT_POSITION].valueOf(), 'ether').toString()
  const spentToday = web3.fromWei(dailyLimitEth[SPENT_TODAY_POS].valueOf(), 'ether').toString()

  return { value: Number(limit), spentToday: Number(spentToday) }
}

export const getDailyLimitAddress = async (safeAddress: string) => {
  const dailyLimitModule = await getDailyLimitModuleFrom(safeAddress)

  return dailyLimitModule.address
}

export const getEditDailyLimitData = async (safeAddress: string, token: number, dailyLimit: number) => {
  const web3 = getWeb3()
  const dailyLimitModule = await getDailyLimitModuleFrom(safeAddress)
  const dailyLimitInWei = web3.toWei(dailyLimit, 'ether')
  return dailyLimitModule.contract.changeDailyLimit.getData(token, dailyLimitInWei)
}
