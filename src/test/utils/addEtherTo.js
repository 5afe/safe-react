// @flow
import { getProviderInfo, getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import withdrawn, { DESTINATION_PARAM, VALUE_PARAM } from '~/routes/safe/component/Withdrawn/withdrawn'

export const addEtherTo = async (address: string, eth: string) => {
  const web3 = getWeb3()
  const accounts = await promisify(cb => web3.eth.getAccounts(cb))
  const txData = { from: accounts[0], to: address, value: web3.toWei(eth, 'ether') }
  return promisify(cb => web3.eth.sendTransaction(txData, cb))
}

export const executeWithdrawnOn = async (safeAddress: string, value: number) => {
  const providerInfo = await getProviderInfo()
  const userAddress = providerInfo.account

  const values = {
    [DESTINATION_PARAM]: userAddress,
    [VALUE_PARAM]: `${value}`,
  }

  return withdrawn(values, safeAddress, userAddress)
}
