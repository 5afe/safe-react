import { AbiItem } from 'web3-utils'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { AllowanceModule } from 'src/types/contracts/AllowanceModule.d'

import SpendingLimitModule from './artifacts/AllowanceModule.json'

/**
 * Creates a Contract instance of the SpendingLimitModule contract
 */
export const getSpendingLimitContract = () => {
  const web3 = getWeb3()

  return new web3.eth.Contract(
    SpendingLimitModule.abi as AbiItem[],
    SPENDING_LIMIT_MODULE_ADDRESS,
  ) as unknown as AllowanceModule
}
