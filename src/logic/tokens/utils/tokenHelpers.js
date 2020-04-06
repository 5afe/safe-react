// @flow
import { List } from 'immutable'

import logo from '~/assets/icons/icon_etherTokens.svg'
import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import { type Token, makeToken } from '~/logic/tokens/store/model/token'
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const ETH_ADDRESS = '0x000'
export const SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH = '0x42842e0e'
export const DECIMALS_METHOD_HASH = '313ce567'

export const isEther = (symbol: string) => symbol === 'ETH'

export const getEthAsToken = (balance: string) => {
  const eth = makeToken({
    address: ETH_ADDRESS,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUri: logo,
    balance,
  })

  return eth
}

export const calculateActiveErc20TokensFrom = (tokens: List<Token>) => {
  const activeTokens = List().withMutations((list) =>
    tokens.forEach((token: Token) => {
      const isDeactivated = isEther(token.symbol) || !token.status
      if (isDeactivated) {
        return
      }

      list.push(token)
    }),
  )

  return activeTokens
}

export const isAddressAToken = async (tokenAddress: string) => {
  // SECOND APPROACH:
  // They both seem to work the same
  // const tokenContract = await getStandardTokenContract()
  // try {
  //   await tokenContract.at(tokenAddress)
  // } catch {
  //   return 'Not a token address'
  // }

  const web3 = getWeb3()
  const call = await web3.eth.call({ to: tokenAddress, data: web3.utils.sha3('totalSupply()') })

  return call !== '0x'
}

export const isTokenTransfer = (data: string, value: number): boolean =>
  !!data && data.substring(0, 10) === '0xa9059cbb' && value === 0

export const isMultisendTransaction = (data: string, value: number): boolean =>
  !!data && data.substring(0, 10) === '0x8d80ff0a' && value === 0

// 7de7edef - changeMasterCopy (308, 8)
// f08a0323 - setFallbackHandler (550, 8)
export const isUpgradeTransaction = (data: string) =>
  !!data && data.substr(308, 8) === '7de7edef' && data.substr(550, 8) === 'f08a0323'

export const isERC721Contract = async (contractAddress: string): boolean => {
  const ERC721Token = await getStandardTokenContract()
  let isERC721 = false
  try {
    isERC721 = true
    await ERC721Token.at(contractAddress)
  } catch (error) {
    console.warn('Asset not found')
  }
  return isERC721
}
