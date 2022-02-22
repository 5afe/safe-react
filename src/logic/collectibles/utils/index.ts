import { getERC721TokenContract, getERC20TokenContract } from 'src/logic/tokens/store/actions/fetchTokens'
import { CollectibleTx } from 'src/routes/safe/components/Balances/SendModal/screens/ReviewCollectible'

// safeTransferFrom(address,address,uint256)
export const SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH = '42842e0e'

/**
 * Returns a method identifier based on the asset specified and the current network
 * @param {string} contractAddress
 * @returns string
 */
export const getTransferMethodByContractAddress = (): string => {
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

  const methodToCall = getTransferMethodByContractAddress()
  let transferParams = [tx.recipientAddress, tx.nftTokenId]
  let NFTTokenInstance

  if (methodToCall.includes(SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH)) {
    // we add the `from` param for the `safeTransferFrom` method call
    transferParams = [safeAddress, ...transferParams]
    NFTTokenInstance = getERC721TokenContract(tx.assetAddress)
  } else {
    // we fallback to an ERC20 Token contract whose ABI implements the `transfer` method
    NFTTokenInstance = getERC20TokenContract(tx.assetAddress)
  }

  return NFTTokenInstance.methods[methodToCall](...transferParams).encodeABI()
}
