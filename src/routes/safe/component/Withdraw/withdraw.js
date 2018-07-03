// @flow
import { List } from 'immutable'
import { getWeb3 } from '~/wallets/getWeb3'
import { getGnosisSafeContract, getCreateDailyLimitExtensionContract } from '~/wallets/safeContracts'
import { type DailyLimitProps } from '~/routes/safe/store/model/dailyLimit'
import { checkReceiptStatus, calculateGasOf, calculateGasPrice, EMPTY_DATA } from '~/wallets/ethTransactions'
import { type Safe } from '~/routes/safe/store/model/safe'
import { buildExecutedConfirmationFrom, storeTransaction } from '~/routes/safe/component/AddTransaction/createTransactions'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'

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

const withdraw = async (values: Object, safe: Safe, userAccount: string): Promise<void> => {
  const web3 = getWeb3()
  const safeAddress = safe.get('address')
  const dailyLimitModule = await getDailyLimitModuleFrom(safeAddress)

  const destination = values[DESTINATION_PARAM]
  const valueInEth = values[VALUE_PARAM]
  const value = web3.toWei(valueInEth, 'ether')

  const dailyLimitData = dailyLimitModule.contract.executeDailyLimit.getData(0, destination, value)
  const gas = await calculateGasOf(dailyLimitData, userAccount, dailyLimitModule.address)
  const gasPrice = await calculateGasPrice()

  const txHash = await dailyLimitModule.executeDailyLimit(0, destination, value, { from: userAccount, gas, gasPrice })
  checkReceiptStatus(txHash.tx)

  const nonce = Date.now()
  const executedConfirmations: List<Confirmation> = buildExecutedConfirmationFrom(safe.get('owners'), userAccount)

  return storeTransaction(`Withdraw movement of ${valueInEth}`, nonce, destination, valueInEth, userAccount, executedConfirmations, txHash.tx, safeAddress, safe.get('threshold'), EMPTY_DATA)
}

export default withdraw
