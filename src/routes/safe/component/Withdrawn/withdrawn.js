// @flow
import { getWeb3 } from '~/wallets/getWeb3'
import { getGnosisSafeContract, getCreateDailyLimitExtensionContract } from '~/wallets/safeContracts'

export const DESTINATION_PARAM = 'destination'
export const VALUE_PARAM = 'ether'

const withdrawn = async (values: Object, safeAddress: string, userAccount: string): Promise<void> => {
  const web3 = getWeb3()
  const gnosisSafe = getGnosisSafeContract(web3).at(safeAddress)

  const extensions = await gnosisSafe.getExtensions()
  const dailyAddress = extensions[0]
  const dailyLimitExtension = getCreateDailyLimitExtensionContract(web3).at(dailyAddress)

  if (await dailyLimitExtension.gnosisSafe() !== gnosisSafe.address) {
    throw new Error('Using an extension of different safe')
  }

  const CALL = 0
  await gnosisSafe.executeExtension(
    values[DESTINATION_PARAM],
    values[VALUE_PARAM],
    0,
    CALL,
    dailyLimitExtension.address,
    { from: userAccount },
  )
}

export default withdrawn
