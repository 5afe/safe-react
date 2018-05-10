// @flow
import { getWeb3 } from '~/wallets/getWeb3'
import { getGnosisSafeContract, getCreateDailyLimitExtensionContract } from '~/wallets/safeContracts'

export const DESTINATION_PARAM = 'destination'
export const VALUE_PARAM = 'ether'

const withdrawn = async (values: Object, safeAddress: string, userAccount: string): Promise<void> => {
  const web3 = getWeb3()
  const gnosisSafe = getGnosisSafeContract(web3).at(safeAddress)

  const modules = await gnosisSafe.getModules()
  const dailyAddress = modules[0]

  const dailyLimitModule = getCreateDailyLimitExtensionContract(web3).at(dailyAddress)
  if (await dailyLimitModule.manager.call() !== gnosisSafe.address) {
    throw new Error('Using an extension of different safe')
  }

  const destination = values[DESTINATION_PARAM]
  const value = web3.toWei(values[VALUE_PARAM], 'ether')

  await dailyLimitModule.executeDailyLimit(
    destination,
    value,
    0,
    { from: userAccount, gas: '5000000' },
  )
}

export default withdrawn
