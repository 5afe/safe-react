// @flow
import { getWeb3 } from '~/wallets/getWeb3'
import { getGnosisSafeContract, getCreateDailyLimitExtensionContract } from '~/wallets/safeContracts'
import { type DailyLimitProps } from '~/routes/safe/store/model/dailyLimit'
import executeTransaction from '~/wallets/ethTransactions'

export const LIMIT_POSITION = 0
export const SPENT_TODAY_POS = 1
export const DESTINATION_PARAM = 'destination'
export const VALUE_PARAM = 'ether'

const getDailyLimitModuleFrom = async (safeAddress) => {
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

const withdrawn = async (values: Object, safeAddress: string, userAccount: string): Promise<void> => {
  const web3 = getWeb3()
  const dailyLimitModule = await getDailyLimitModuleFrom(safeAddress)

  const destination = values[DESTINATION_PARAM]
  const value = web3.toWei(values[VALUE_PARAM], 'ether')

  const dailyLimitData = dailyLimitModule.contract.executeDailyLimit.getData(0, destination, value)

  return executeTransaction(dailyLimitData, userAccount, dailyLimitModule.address)
}

export default withdrawn
