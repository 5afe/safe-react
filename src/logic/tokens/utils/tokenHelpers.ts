import memoize from 'lodash.memoize'
import logo from 'src/assets/icons/icon_etherTokens.svg'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import {
  getStandardTokenContract,
  getTokenInfos,
  getERC721TokenContract,
} from 'src/logic/tokens/store/actions/fetchTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { ALTERNATIVE_TOKEN_ABI } from 'src/logic/tokens/utils/alternativeAbi'
import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { isEmptyData } from 'src/routes/safe/store/actions/transactions/utils/transactionHelpers'
import { TxServiceModel } from 'src/routes/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'

export const ETH_ADDRESS = '0x000'
export const SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH = '42842e0e'

export const getEthAsToken = (balance: string): Token => {
  return makeToken({
    address: ETH_ADDRESS,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUri: logo,
    balance,
  })
}

export const isAddressAToken = async (tokenAddress): Promise<boolean> => {
  // SECOND APPROACH:
  // They both seem to work the same
  // const tokenContract = await getStandardTokenContract()
  // try {
  //   await tokenContract.at(tokenAddress)
  // } catch {
  //   return 'Not a token address'
  // }
  const call = await web3.eth.call({ to: tokenAddress, data: web3.utils.sha3('totalSupply()') })

  return call !== '0x'
}

export const isTokenTransfer = (tx: any): boolean => {
  return !isEmptyData(tx.data) && tx.data.substring(0, 10) === '0xa9059cbb' && Number(tx.value) === 0
}

export const isSendERC721Transaction = (tx: any, txCode: string, knownTokens: any) => {
  return (
    (txCode && txCode.includes(SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH)) ||
    (isTokenTransfer(tx) && !knownTokens.get(tx.to))
  )
}

export const getERC721Symbol = memoize(async (contractAddress) => {
  const ERC21token = await getERC721TokenContract()
  const tokenInstance = await ERC21token.at(contractAddress)
  return tokenInstance.symbol()
})

export const getERC20DecimalsAndSymbol = async (
  tokenAddress: string,
): Promise<{ decimals: number; symbol: string }> => {
  const tokenInfos = await getTokenInfos(tokenAddress)

  if (tokenInfos === null) {
    const [tokenDecimals, tokenSymbol] = await generateBatchRequests({
      abi: ALTERNATIVE_TOKEN_ABI,
      address: tokenAddress,
      methods: ['decimals', 'symbol'],
    })

    return { decimals: Number(tokenDecimals), symbol: tokenSymbol }
  }

  return { decimals: Number(tokenInfos.decimals), symbol: tokenInfos.symbol }
}

export const isSendERC20Transaction = async (
  tx: TxServiceModel,
  txCode: string,
  knownTokens: any,
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
    isERC721 = true
    await ERC721Token.at(contractAddress)
  } catch (error) {
    console.warn('Asset not found')
  }

  return isERC721
}
