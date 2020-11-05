import { AbiItem } from 'web3-utils'

import { getNetworkInfo } from 'src/config'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import {
  getStandardTokenContract,
  getTokenInfos,
  getERC721TokenContract,
} from 'src/logic/tokens/store/actions/fetchTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { ALTERNATIVE_TOKEN_ABI } from 'src/logic/tokens/utils/alternativeAbi'
import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { isEmptyData } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { TxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { sameString } from 'src/utils/strings'
import { TOKEN_TRANSFER_METHODS_NAMES } from 'src/logic/safe/store/models/types/transactions.d'
import { store } from 'src/store'
import { nftAssetsListAddressesSelector } from 'src/logic/collectibles/store/selectors'

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

export const isSendERC721Transaction = (tx: TxServiceModel): boolean => {
  let hasERC721Transfer = false

  if (tx.dataDecoded && sameString(tx.dataDecoded.method, TOKEN_TRANSFER_METHODS_NAMES.SAFE_TRANSFER_FROM)) {
    hasERC721Transfer = tx.dataDecoded.parameters.findIndex((param) => sameString(param.name, 'tokenId')) !== -1
  }

  // Note: this is only valid with our current case (client rendering), if we move to server side rendering we need to refactor this
  const state = store.getState()
  const knownAssets = nftAssetsListAddressesSelector(state)
  return knownAssets.includes(tx.to) || hasERC721Transfer
}

export const getERC721Symbol = async (contractAddress: string): Promise<string> => {
  let tokenSymbol = 'UNKNOWN'
  try {
    const ERC721token = await getERC721TokenContract()
    const tokenInstance = await ERC721token.at(contractAddress)
    tokenSymbol = tokenInstance.symbol()
  } catch (err) {
    // If the contract address is an ENS token contract, we know that the ERC721 standard is not proper implemented
    // The method symbol() is missing
    const ENS_TOKEN_CONTRACT = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'
    if (!sameString(contractAddress, ENS_TOKEN_CONTRACT)) {
      console.error(`Failed to retrieve token symbol for ERC721 token ${contractAddress}`)
    }
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

export const isSendERC20Transaction = async (tx: TxServiceModel): Promise<boolean> => {
  let isSendTokenTx = !isSendERC721Transaction(tx) && isTokenTransfer(tx)

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
