import { getNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { TxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { getERC721TokenContract, getStandardTokenContract } from 'src/logic/tokens/store/actions/fetchTokens'
import { TokenState } from 'src/logic/tokens/store/reducer/tokens'
import { isTokenTransfer } from 'src/logic/tokens/utils/tokenHelpers'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { CollectibleTx } from 'src/routes/safe/components/Balances/SendModal/screens/ReviewCollectible'

// CryptoKitties Contract Addresses by network
// This is an exception made for a popular NFT that's not ERC721 standard-compatible,
//  so we can allow the user to transfer the assets by using `transferFrom` instead of
//  the standard `safeTransferFrom` method.
export const CK_ADDRESS = {
  [ETHEREUM_NETWORK.MAINNET]: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
  [ETHEREUM_NETWORK.RINKEBY]: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
}

// safeTransferFrom(address,address,uint256)
export const SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH = '42842e0e'

/**
 * Verifies that a tx received by the transaction service is an ERC721 token-related transaction
 * @param {TxServiceModel} tx
 * @param {string | undefined} txCode
 * @param {TokenState | undefined} knownTokens
 * @returns boolean
 */
export const isSendERC721Transaction = (tx: TxServiceModel, txCode?: string, knownTokens?: TokenState): boolean => {
  // "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85" - ens token contract, includes safeTransferFrom
  // but no proper ERC721 standard implemented
  return (
    (txCode?.includes(SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH) &&
      tx.to !== '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85') ||
    (isTokenTransfer(tx) && !knownTokens?.get(tx.to))
  )
}

/**
 * Returns the symbol of the provided ERC721 contract
 * @param {string} contractAddress
 * @returns Promise<string>
 */
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

/**
 * Verifies if the provided contract is a valid ERC721
 * @param {string} contractAddress
 * @returns boolean
 */
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

/**
 * Returns a method identifier based on the asset specified and the current network
 * @param {string} contractAddress
 * @returns string
 */
export const getTransferMethodByContractAddress = (contractAddress: string): string => {
  if (sameAddress(contractAddress, CK_ADDRESS[getNetworkId()])) {
    // on mainnet `transferFrom` seems to work fine but we can assure that `transfer` will work on both networks
    // so that's the reason why we're falling back to `transfer` for CryptoKitties
    return 'transfer'
  }

  return `0x${SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH}`
}

/**
 * Builds the encodedABI data for the transfer of an NFT token
 * @param {CollectibleTx} tx
 * @param {string} safeAddress
 * @returns Promise<string>
 */
export const generateERC721TransferTxData = async (
  tx: CollectibleTx,
  safeAddress: string | undefined,
): Promise<string> => {
  if (!safeAddress) {
    throw new Error('Failed to build NFT transfer tx data. SafeAddress is not defined.')
  }

  const methodToCall = getTransferMethodByContractAddress(tx.assetAddress)
  let transferParams = [tx.recipientAddress, tx.nftTokenId]
  let NFTTokenContract

  if (methodToCall.includes(SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH)) {
    // we add the `from` param for the `safeTransferFrom` method call
    transferParams = [safeAddress, ...transferParams]
    NFTTokenContract = await getERC721TokenContract()
  } else {
    // we fallback to an ERC20 Token contract whose ABI implements the `transfer` method
    NFTTokenContract = await getStandardTokenContract()
  }

  const tokenInstance = await NFTTokenContract.at(tx.assetAddress)

  return tokenInstance.contract.methods[methodToCall](...transferParams).encodeABI()
}
