import { AbiItem } from 'web3-utils'

import { getNetworkInfo } from 'src/config'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import {
  getStandardTokenContract,
  getTokenInfos,
  getERC721TokenContract,
} from 'src/logic/tokens/store/actions/fetchTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { TokenState } from 'src/logic/tokens/store/reducer/tokens'
import { ALTERNATIVE_TOKEN_ABI } from 'src/logic/tokens/utils/alternativeAbi'
import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { isEmptyData } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { TxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'

export const SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH = '42842e0e'

export const getEthAsToken = (balance: string | number): Token => {
  const { nativeCoin } = getNetworkInfo()
  return makeToken({
    ...nativeCoin,
    balance,
  })
}

export const isAddressAToken = async (tokenAddress: string): Promise<boolean> => {
  // SECOND APPROACH:
  // They both seem to work the same
  // const tokenContract = await getStandardTokenContract()
  // try {
  //   await tokenContract.at(tokenAddress)
  // } catch {
  //   return 'Not a token address'
  // }
  const call = await web3.eth.call({ to: tokenAddress, data: web3.utils.sha3('totalSupply()') as string })

  return call !== '0x'
}

export const isTokenTransfer = (tx: TxServiceModel): boolean => {
  return !isEmptyData(tx.data) && tx.data?.substring(0, 10) === '0xa9059cbb' && Number(tx.value) === 0
}

export const isSendERC721Transaction = (tx: TxServiceModel, txCode?: string, knownTokens?: TokenState): boolean => {
  // "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85" - ens token contract, includes safeTransferFrom
  // but no proper ERC721 standard implemented
  return (
    (txCode?.includes(SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH) &&
      tx.to !== '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85') ||
    (isTokenTransfer(tx) && !knownTokens?.get(tx.to))
  )
}

export const getERC721Symbol = async (contractAddress: string): Promise<string> => {
  let tokenSymbol = 'UNKNOWN'
  try {
    const ERC721token = await getERC721TokenContract()
    const tokenInstance = await ERC721token.at(contractAddress)
    tokenSymbol = tokenInstance.symbol()
  } catch (err) {
    console.error(`Failed to retrieve token symbol for ERC721 token ${contractAddress}`)
  }
  return tokenSymbol
}

export const getERC20DecimalsAndSymbol = async (
  tokenAddress: string,
): Promise<{ decimals: number; symbol: string }> => {
  const tokenInfo = { decimals: 18, symbol: 'UNKNOWN' }
  try {
    const storedTokenInfo = await getTokenInfos(tokenAddress)

    if (!storedTokenInfo) {
      const [, tokenDecimals, tokenSymbol] = await generateBatchRequests<
        [undefined, string | undefined, string | undefined]
      >({
        abi: ALTERNATIVE_TOKEN_ABI as AbiItem[],
        address: tokenAddress,
        methods: ['decimals', 'symbol'],
      })
      return { decimals: Number(tokenDecimals), symbol: tokenSymbol ?? 'UNKNOWN' }
    }
    return { decimals: Number(storedTokenInfo.decimals), symbol: storedTokenInfo.symbol }
  } catch (err) {
    console.error(`Failed to retrieve token info for ERC20 token ${tokenAddress}`)
  }

  return tokenInfo
}

export const isSendERC20Transaction = async (
  tx: TxServiceModel,
  txCode?: string,
  knownTokens?: TokenState,
): Promise<boolean> => {
  let isSendTokenTx = !isSendERC721Transaction(tx, txCode, knownTokens) && isTokenTransfer(tx)

  if (isSendTokenTx) {
    const { decimals, symbol } = await getERC20DecimalsAndSymbol(tx.to)

    // some contracts may implement the same methods as in ERC20 standard
    // we may falsely treat them as tokens, so in case we get any errors when getting token info
    // we fallback to displaying custom transaction
    isSendTokenTx = decimals !== null && symbol !== null
  }

  return isSendTokenTx
}

export const isERC721Contract = async (contractAddress: string): Promise<boolean> => {
  const ERC721Token = await getStandardTokenContract()
  let isERC721 = false

  try {
    await ERC721Token.at(contractAddress)
    isERC721 = true
  } catch (error) {
    console.warn('Asset not found')
  }

  return isERC721
}
