// @flow
import { getGnosisSafeContract, getCreateDailyLimitExtensionContract } from '~/wallets/safeContracts'

export const DESTINATION_PARAM = 'destination'
export const VALUE_PARAM = 'ether'

const withdrawn = async (values: Object, safeAddress: string, userAccount: string): Promise<void> => {
  const gnosisSafe = getGnosisSafeContract().at(safeAddress)
  const dailyLimitExtension = getCreateDailyLimitExtensionContract().at(gnosisSafe.getExtensions()[0])

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
